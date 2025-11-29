import { useAudio } from './useAudio';

import { PresetTunings, frequencyToNote, getDetectionStatus } from '@/utils/frequency';
import { type Tuning, TuningPresets, FrequencyConstants, DetectionStatus } from '@/types/tuner';

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
    const bufferSize = 25;

    let animationFrameId: number;

    const allTunings = computed((): Tuning[] => [...PresetTunings, ...customTunings.value]);

    const activeString = computed(
        (): Tuning['strings'][0] => currentTuning.value.strings[activeStringIndex.value]!,
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
        if (buffer.length > bufferSize) {
            buffer.shift();
        }

        const sorted = [...buffer].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
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
        const isPreciselyInTune: boolean = Math.abs(currentDeviation) <= 10;

        if (isPreciselyInTune) {
            if (inTuneStartTime.value === 0) {
                inTuneStartTime.value = now;
                hasPlayedSuccessSound.value = false;
            } else {
                const tuneDuration: number = now - inTuneStartTime.value;

                if (
                    tuneDuration >= 800 &&
                    !hasPlayedSuccessSound.value &&
                    !successSoundCooldown.value
                ) {
                    playSuccessSound();
                    hasPlayedSuccessSound.value = true;

                    successSoundCooldown.value = true;
                    setTimeout((): void => {
                        successSoundCooldown.value = false;
                        hasPlayedSuccessSound.value = false;
                    }, 1500);
                }
            }
        } else {
            resetTuneDetection();
        }
    };

    const playSuccessSound = (): void => {
        const baseFrequency: number = activeString.value.frequency;
        playReferenceNote({ frequency: baseFrequency * 2, duration: 300, volume: 0.8 });
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
