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

    const frequencyBuffer = ref<number[]>([]);
    const deviationBuffer = ref<number[]>([]);
    const bufferSize = 8;

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
    };

    const smoothValue = (buffer: number[], newValue: number): number => {
        buffer.push(newValue);

        if (buffer.length > bufferSize) {
            buffer.shift();
        }

        // Use weighted average for better smoothing (recent values have more weight)
        let sum = 0;
        let weightSum = 0;

        for (let i = 0; i < buffer.length; i++) {
            const weight = (i + 1) / buffer.length; // Linear weights
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
        } else {
            detectionStatus.value = DetectionStatus.Unstable;
            frequencyBuffer.value = [];
            deviationBuffer.value = [];
        }

        animationFrameId = requestAnimationFrame(analyzeAudio);
    };

    const selectString = (index: number): void => {
        activeStringIndex.value = index;
        currentFrequency.value = 0;
        deviation.value = 0;
        detectionStatus.value = DetectionStatus.Unstable;
        frequencyBuffer.value = [];
        deviationBuffer.value = [];
    };

    const playActiveString = (): void => {
        playReferenceNote(activeString.value.frequency);
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
