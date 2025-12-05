import { useAudio } from './useAudio';

import { PresetTunings, frequencyToNote, getDetectionStatus } from '@/utils/frequency';
import { type Tuning, TuningPresets, FrequencyConstants, DetectionStatus } from '@/types/tuner';

const LOW_FREQUENCY_THRESHOLD_HZ = 100;
const LOW_FREQ_BUFFER_SIZE = 9;
const HIGH_FREQ_BUFFER_SIZE = 7;
const LOW_FREQ_SUCCESS_THRESHOLD_CENTS = 22;
const HIGH_FREQ_SUCCESS_THRESHOLD_CENTS = 20;
const LOW_FREQ_STABILITY_DURATION_MS = 700;
const HIGH_FREQ_STABILITY_DURATION_MS = 600;
const SUCCESS_SOUND_COOLDOWN_MS = 1500;
const SUCCESS_SOUND_DURATION_MS = 300;
const SUCCESS_SOUND_VOLUME = 0.8;
const MAX_REASONABLE_DEVIATION = 1000;
const OCTAVE_TOLERANCE_LOWER = 0.5;
const OCTAVE_TOLERANCE_UPPER = 2.0;

const CUSTOM_TUNINGS_STORAGE_KEY = 'guitar-tuner-custom-tunings';
const SELECTED_TUNING_STORAGE_KEY = 'guitar-tuner-selected-tuning';

const calculateCentsDeviation = (measuredFrequency: number, referenceFrequency: number): number => {
    if (!Number.isFinite(measuredFrequency) || !Number.isFinite(referenceFrequency)) {
        return 0;
    }

    if (referenceFrequency <= 0 || measuredFrequency <= 0) {
        return 0;
    }

    const ratio = measuredFrequency / referenceFrequency;

    if (ratio <= 0) {
        return 0;
    }

    const cents = FrequencyConstants.CentsPerOctave * Math.log2(ratio);

    if (!Number.isFinite(cents)) {
        return 0;
    }

    if (Math.abs(cents) > MAX_REASONABLE_DEVIATION) {
        return 0;
    }

    return cents;
};

const correctOctave = (measuredFrequency: number, referenceFrequency: number): number => {
    if (!Number.isFinite(measuredFrequency) || !Number.isFinite(referenceFrequency)) {
        return measuredFrequency;
    }

    if (referenceFrequency <= 0 || measuredFrequency <= 0) {
        return measuredFrequency;
    }

    let corrected = measuredFrequency;
    const ratio = corrected / referenceFrequency;

    if (ratio < OCTAVE_TOLERANCE_LOWER) {
        while (corrected / referenceFrequency < OCTAVE_TOLERANCE_LOWER) {
            corrected *= 2;
        }
    } else if (ratio >= OCTAVE_TOLERANCE_UPPER) {
        while (corrected / referenceFrequency >= OCTAVE_TOLERANCE_UPPER) {
            corrected /= 2;
        }
    }

    return corrected;
};

export function useTuner() {
    const { initialize, getCurrentFrequency, playReferenceNote, isInitialized } = useAudio();

    const customTunings = ref<Tuning[]>([]);
    const currentTuning = ref<Tuning>(PresetTunings[0]!);
    const activeStringIndex = ref<number>(0);

    const currentFrequency = ref<number>(0);
    const currentNote = ref<string>('');
    const deviation = ref<number>(0);
    const isListening = ref<boolean>(false);
    const detectionStatus = ref<DetectionStatus>(DetectionStatus.Unstable);

    const inTuneStartTime = ref<number>(0);
    const hasPlayedSuccessSound = ref<boolean>(false);
    const successSoundCooldown = ref<boolean>(false);

    const frequencyBuffer = ref<number[]>([]);
    const deviationBuffer = ref<number[]>([]);

    let animationFrameId: number;

    const allTunings = computed((): Tuning[] => {
        return [...PresetTunings, ...customTunings.value];
    });

    const activeString = computed((): Tuning['strings'][0] => {
        return currentTuning.value.strings[activeStringIndex.value]!;
    });

    const getBufferSize = computed((): number => {
        if (activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ) {
            return LOW_FREQ_BUFFER_SIZE;
        }

        return HIGH_FREQ_BUFFER_SIZE;
    });

    const getSuccessThreshold = computed((): number => {
        if (activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ) {
            return LOW_FREQ_SUCCESS_THRESHOLD_CENTS;
        }

        return HIGH_FREQ_SUCCESS_THRESHOLD_CENTS;
    });

    const getRequiredDuration = computed((): number => {
        if (activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ) {
            return LOW_FREQ_STABILITY_DURATION_MS;
        }

        return HIGH_FREQ_STABILITY_DURATION_MS;
    });

    const loadTunings = (): void => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedTunings = localStorage.getItem(CUSTOM_TUNINGS_STORAGE_KEY);

        if (storedTunings) {
            try {
                const parsed = JSON.parse(storedTunings);
                customTunings.value = Array.isArray(parsed) ? parsed : [];
            } catch {
                customTunings.value = [];
            }
        }

        const storedSelected = localStorage.getItem(SELECTED_TUNING_STORAGE_KEY);

        if (storedSelected) {
            const tuning = allTunings.value.find((t: Tuning) => t.id === storedSelected);

            if (tuning) {
                currentTuning.value = tuning;
            }
        }
    };

    const saveCustomTunings = (): void => {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(CUSTOM_TUNINGS_STORAGE_KEY, JSON.stringify(customTunings.value));
    };

    const saveSelectedTuning = (): void => {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(SELECTED_TUNING_STORAGE_KEY, currentTuning.value.id);
    };

    const initializeFrequencyBuffer = (): void => {
        const bufferSize = getBufferSize.value;
        const referenceFrequency = activeString.value.frequency;
        frequencyBuffer.value = Array(bufferSize).fill(referenceFrequency);
    };

    const initializeDeviationBuffer = (): void => {
        const bufferSize = getBufferSize.value;
        deviationBuffer.value = Array(bufferSize).fill(0);
    };

    const startListening = async (): Promise<void> => {
        if (!isInitialized.value) {
            await initialize();
        }

        isListening.value = true;
        initializeFrequencyBuffer();
        initializeDeviationBuffer();
        analyzeAudio();
    };

    const stopListening = (): void => {
        isListening.value = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        resetTuneDetection();
    };

    const smoothValue = (buffer: number[], newValue: number): number => {
        if (!Number.isFinite(newValue)) {
            if (buffer.length > 0) {
                const lastValid: number = buffer[buffer.length - 1]!;

                return Number.isFinite(lastValid) ? lastValid : 0;
            }

            return 0;
        }

        buffer.push(newValue);

        if (buffer.length > getBufferSize.value) {
            buffer.shift();
        }

        if (buffer.length < 2) {
            return newValue;
        }

        const validBuffer: number[] = buffer.filter(val => Number.isFinite(val));
        if (validBuffer.length === 0) {
            return 0;
        }

        if (validBuffer.length === 1) {
            return validBuffer[0]!;
        }

        const sorted: number[] = [...validBuffer].sort((a, b) => a - b);
        const mid: number = Math.floor(sorted.length / 2);
        const median: number =
            sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;

        if (!Number.isFinite(median)) {
            return validBuffer[validBuffer.length - 1]!;
        }

        const tolerance: number = median < 100 ? 0.25 : 0.15;
        const tightValues: number[] = validBuffer.filter(
            val => Math.abs(val - median) < Math.max(median * tolerance, 15),
        );

        if (tightValues.length === 0) {
            return median;
        }

        if (tightValues.length === 1) {
            return tightValues[0]!;
        }

        let weightedSum: number = 0;
        let weightTotal: number = 0;

        for (let i = 0; i < tightValues.length; i++) {
            const ageWeight: number = Math.exp(-i * 0.4);
            const proximityWeight: number = Math.exp(
                -Math.abs(tightValues[i]! - median) / (median * 0.3),
            );
            const weight: number = ageWeight * proximityWeight;

            weightedSum += tightValues[i]! * weight;
            weightTotal += weight;
        }

        const result: number = weightedSum / (weightTotal + 0.001);

        return Number.isFinite(result) ? result : median;
    };

    const analyzeAudio = (): void => {
        if (!isListening.value) {
            return;
        }

        const rawFrequency: number | null = getCurrentFrequency();

        if (
            rawFrequency &&
            Number.isFinite(rawFrequency) &&
            rawFrequency >= FrequencyConstants.MinDetection &&
            rawFrequency <= FrequencyConstants.MaxDetection
        ) {
            const correctedFrequency = correctOctave(rawFrequency, activeString.value.frequency);
            const smoothedFrequency: number = smoothValue(
                frequencyBuffer.value,
                correctedFrequency,
            );

            currentFrequency.value = Number.isFinite(smoothedFrequency) ? smoothedFrequency : 0;

            const note = frequencyToNote(smoothedFrequency);
            currentNote.value = note;

            const centsDeviation: number = calculateCentsDeviation(
                smoothedFrequency,
                activeString.value.frequency,
            );
            const finiteCents: number = Number.isFinite(centsDeviation) ? centsDeviation : 0;
            const smoothedDeviation: number = smoothValue(deviationBuffer.value, finiteCents);
            deviation.value = Number.isFinite(smoothedDeviation)
                ? Math.round(smoothedDeviation)
                : 0;

            const newStatus: DetectionStatus = getDetectionStatus(smoothedDeviation);
            detectionStatus.value = newStatus;

            handleSuccessSound(smoothedDeviation);
        } else {
            if (currentFrequency.value === 0) {
                detectionStatus.value = DetectionStatus.Unstable;
            }
        }

        animationFrameId = requestAnimationFrame(analyzeAudio);
    };

    const handleSuccessSound = (currentDeviation: number): void => {
        if (!Number.isFinite(currentDeviation)) {
            return;
        }

        const now: number = Date.now();
        const isPreciselyInTune: boolean = Math.abs(currentDeviation) <= getSuccessThreshold.value;

        if (isPreciselyInTune) {
            if (inTuneStartTime.value === 0) {
                inTuneStartTime.value = now;
                hasPlayedSuccessSound.value = false;
            } else {
                const tuneDuration: number = now - inTuneStartTime.value;

                if (
                    tuneDuration >= getRequiredDuration.value &&
                    !hasPlayedSuccessSound.value &&
                    !successSoundCooldown.value
                ) {
                    playSuccessSound();

                    hasPlayedSuccessSound.value = true;
                    successSoundCooldown.value = true;

                    setTimeout((): void => {
                        successSoundCooldown.value = false;
                        hasPlayedSuccessSound.value = false;
                    }, SUCCESS_SOUND_COOLDOWN_MS);
                }
            }
        } else {
            resetTuneDetection();
        }
    };

    const playSuccessSound = (): void => {
        const baseFrequency: number = activeString.value.frequency;
        playReferenceNote({
            frequency: baseFrequency * 2,
            duration: SUCCESS_SOUND_DURATION_MS,
            volume: SUCCESS_SOUND_VOLUME,
        });
    };

    const resetTuneDetection = (): void => {
        inTuneStartTime.value = 0;
        hasPlayedSuccessSound.value = false;
    };

    const selectString = (index: number): void => {
        activeStringIndex.value = index;
        currentFrequency.value = 0;
        deviation.value = 0;
        detectionStatus.value = DetectionStatus.Unstable;
        resetTuneDetection();
        initializeFrequencyBuffer();
        initializeDeviationBuffer();
    };

    const playActiveString = (): void => {
        playReferenceNote({ frequency: activeString.value.frequency });
    };

    const addCustomTuning = (tuning: Tuning): void => {
        const newTuning: Tuning = {
            ...tuning,
            id: `${TuningPresets.CustomPrefix}${Date.now()}`,
        };

        customTunings.value.push(newTuning);
        saveCustomTunings();
    };

    const updateCustomTuning = (id: string, updatedTuning: Tuning): void => {
        const index = customTunings.value.findIndex((tuning: Tuning) => tuning.id === id);

        if (index !== -1) {
            customTunings.value[index] = updatedTuning;
            saveCustomTunings();

            if (currentTuning.value.id === id) {
                currentTuning.value = updatedTuning;
                selectString(0);
            }
        }
    };

    const deleteCustomTuning = (id: string): void => {
        const index = customTunings.value.findIndex((tuning: Tuning) => tuning.id === id);

        if (index !== -1) {
            customTunings.value.splice(index, 1);
            saveCustomTunings();

            if (currentTuning.value.id === id) {
                currentTuning.value = PresetTunings[0]!;
                saveSelectedTuning();
                selectString(0);
            }
        }
    };

    const selectTuning = (tuningId: string): void => {
        const tuning: Tuning | undefined = allTunings.value.find((t: Tuning) => t.id === tuningId);

        if (tuning) {
            currentTuning.value = tuning;
            saveSelectedTuning();
            selectString(0);
        }
    };

    onMounted((): void => {
        loadTunings();
    });

    onUnmounted((): void => {
        stopListening();
    });

    return {
        currentTuning: readonly(currentTuning),
        allTunings: allTunings,
        customTunings: customTunings,
        activeStringIndex: readonly(activeStringIndex),
        currentFrequency: readonly(currentFrequency),
        currentNote: readonly(currentNote),
        deviation: readonly(deviation),
        isListening: readonly(isListening),
        detectionStatus: readonly(detectionStatus),
        activeString: readonly(activeString),
        startListening,
        stopListening,
        selectString,
        playActiveString,
        addCustomTuning,
        updateCustomTuning,
        deleteCustomTuning,
        selectTuning,
    };
}
