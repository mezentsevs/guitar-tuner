import { AudioProcessor, ReferenceAudio } from '@/utils/audio';

interface PlayNoteParams {
    frequency: number;
    duration?: number;
    volume?: number;
}

export function useAudio() {
    const audioProcessor = ref<AudioProcessor | null>(null);
    const referenceAudio = ref<ReferenceAudio | null>(null);
    const isInitialized = ref<boolean>(false);

    let isPlaybackReady = false;

    const initialize = async (): Promise<void> => {
        if (isInitialized.value) return;

        audioProcessor.value = new AudioProcessor();
        referenceAudio.value = new ReferenceAudio();

        try {
            await audioProcessor.value.initialize();
            isInitialized.value = true;
        } catch (error) {
            throw error;
        }
    };

    const initializePlayback = (): void => {
        if (isPlaybackReady) return;

        referenceAudio.value = new ReferenceAudio();
        isPlaybackReady = true;
    };

    const getCurrentFrequency = (): number | null => {
        return audioProcessor.value?.getFrequency() || null;
    };

    const playReferenceNote = (params: PlayNoteParams): void => {
        if (!isPlaybackReady) {
            initializePlayback();
        }

        referenceAudio.value?.playFrequency(params.frequency, params.duration, params.volume);
    };

    const stop = (): void => {
        audioProcessor.value?.stop();
        isInitialized.value = false;
    };

    onUnmounted((): void => {
        stop();
    });

    return {
        initialize,
        getCurrentFrequency,
        playReferenceNote,
        stop,
        isInitialized: readonly(isInitialized),
    };
}
