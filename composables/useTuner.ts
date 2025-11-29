import { useAudio } from './useAudio';

import { PresetTunings, frequencyToNote, getDetectionStatus } from '@/utils/frequency';
import { type Tuning, TuningPresets, FrequencyConstants, DetectionStatus } from '@/types/tuner';

const LOW_FREQUENCY_THRESHOLD_HZ = 100;
const LOW_FREQ_BUFFER_SIZE = 15;
const HIGH_FREQ_BUFFER_SIZE = 12;
const LOW_FREQ_SUCCESS_THRESHOLD_CENTS = 22;
const HIGH_FREQ_SUCCESS_THRESHOLD_CENTS = 20;
const LOW_FREQ_STABILITY_DURATION_MS = 700;
const HIGH_FREQ_STABILITY_DURATION_MS = 600;
const SUCCESS_SOUND_COOLDOWN_MS = 1500;
const SUCCESS_SOUND_DURATION_MS = 300;
const SUCCESS_SOUND_VOLUME = 0.8;

export function useTuner() {
    const { initialize, getCurrentFrequency, playReferenceNote, isInitialized } = useAudio();

    const currentTuning = ref<Tuning>(PresetTunings[0]!);
    const customTunings = ref<Tuning[]>([]);
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

    const allTunings = computed((): Tuning[] => [...PresetTunings, ...customTunings.value]);

    const activeString = computed(
        (): Tuning['strings'][0] => currentTuning.value.strings[activeStringIndex.value]!,
    );

    const getBufferSize = computed((): number =>
        activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ
            ? LOW_FREQ_BUFFER_SIZE
            : HIGH_FREQ_BUFFER_SIZE,
    );

    const getSuccessThreshold = computed((): number =>
        activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ
            ? LOW_FREQ_SUCCESS_THRESHOLD_CENTS
            : HIGH_FREQ_SUCCESS_THRESHOLD_CENTS,
    );

    const getRequiredDuration = computed((): number =>
        activeString.value.frequency < LOW_FREQUENCY_THRESHOLD_HZ
            ? LOW_FREQ_STABILITY_DURATION_MS
            : HIGH_FREQ_STABILITY_DURATION_MS,
    );

    const startListening = async (): Promise<void> => {
        if (!isInitialized.value) {
            await initialize();
        }

        isListening.value = true;
        frequencyBuffer.value = [];
        deviationBuffer.value = [];
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
        buffer.push(newValue);

        if (buffer.length > getBufferSize.value) {
            buffer.shift();
        }

        let sum = 0;
        let weightSum = 0;

        for (let i = 0; i < buffer.length; i++) {
            const weight = (i + 1) / buffer.length;
            sum += buffer[i]! * weight;
            weightSum += weight;
        }

        return sum / weightSum;
    };

    const analyzeAudio = (): void => {
        if (!isListening.value) return;

        const rawFrequency: number | null = getCurrentFrequency();

        if (
            rawFrequency &&
            rawFrequency > FrequencyConstants.MinDetection &&
            rawFrequency < FrequencyConstants.MaxDetection
        ) {
            const smoothedFrequency: number = smoothValue(frequencyBuffer.value, rawFrequency);
            currentFrequency.value = smoothedFrequency;

            const { note, cents } = frequencyToNote(smoothedFrequency);
            currentNote.value = note;

            const smoothedDeviation: number = smoothValue(deviationBuffer.value, cents);
            deviation.value = Math.round(smoothedDeviation);

            const newStatus: DetectionStatus = getDetectionStatus(smoothedDeviation);
            detectionStatus.value = newStatus;

            handleSuccessSound(smoothedDeviation);
        } else {
            detectionStatus.value = DetectionStatus.Unstable;
            resetTuneDetection();
            frequencyBuffer.value = [];
            deviationBuffer.value = [];
        }

        animationFrameId = requestAnimationFrame(analyzeAudio);
    };

    const handleSuccessSound = (currentDeviation: number): void => {
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
        frequencyBuffer.value = [];
        deviationBuffer.value = [];
    };

    const playActiveString = (): void => {
        playReferenceNote({ frequency: activeString.value.frequency });
    };

    const addCustomTuning = (tuning: Tuning): void => {
        customTunings.value.push({
            ...tuning,
            id: `${TuningPresets.CustomPrefix}${Date.now()}`,
        });
    };

    const selectTuning = (tuningId: string): void => {
        const tuning: Tuning | undefined = allTunings.value.find((t: Tuning) => t.id === tuningId);

        if (tuning) {
            currentTuning.value = tuning;
            selectString(0);
        }
    };

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
        selectTuning,
    };
}
