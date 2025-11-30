<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8 relative">
                <div class="absolute top-0 right-0">
                    <ThemeToggle />
                </div>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Guitar Tuner</h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Professional tuning with real-time audio analysis
                </p>
            </div>

            <!-- Main Content -->
            <div class="grid lg:grid-cols-4 gap-8">
                <!-- Tuning Controls -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Tuning Selector -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Tuning
                        </h2>
                        <TuningSelector
                            :tunings="allTunings"
                            :current-tuning-id="currentTuning.id"
                            @select-tuning="selectTuning"
                            @add-custom-tuning="addCustomTuning" />
                    </div>

                    <!-- Controls -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Controls
                        </h2>
                        <div class="space-y-4">
                            <Button
                                :variant="isListening ? 'danger' : 'primary'"
                                class="w-full h-10"
                                @click="toggleListening">
                                <MicrophoneIcon class="w-4 h-4 mr-2" />
                                {{ isListening ? 'Stop Listening' : 'Start Listening' }}
                            </Button>

                            <Button
                                variant="secondary"
                                class="w-full h-10"
                                @click="playActiveString">
                                <PlayIcon class="w-4 h-4 mr-2" />
                                Play Reference
                            </Button>
                        </div>
                    </div>

                    <!-- Frequency Display -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Current Input
                        </h2>
                        <div class="text-center space-y-2">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">
                                {{ currentFrequency > 0 ? currentFrequency.toFixed(1) : '--' }} Hz
                            </div>
                            <div class="text-xl text-gray-600 dark:text-gray-400">
                                {{ currentNote || '--' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Strings Grid -->
                <div class="lg:col-span-3">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300 min-h-[500px] flex flex-col"
                        :class="stringsContainerClass">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Strings
                        </h2>

                        <div :class="gridLayoutClass" class="flex-1">
                            <StringIndicator
                                v-for="(string, index) in currentTuning.strings"
                                :key="index"
                                :string="string"
                                :deviation="activeStringIndex === index ? deviation : 0"
                                :status="
                                    activeStringIndex === index
                                        ? detectionStatus
                                        : DetectionStatus.Unstable
                                "
                                :is-active="activeStringIndex === index"
                                :is-playing="isPlayingReference && activeStringIndex === index"
                                :class="getStringPositionClass(index)"
                                @select="selectString(index)"
                                @play="playString(index)" />
                        </div>

                        <!-- String Navigation -->
                        <div class="flex flex-wrap justify-center mt-6 gap-2">
                            <Button
                                v-for="(string, index) in currentTuning.strings"
                                :key="index"
                                :variant="activeStringIndex === index ? 'primary' : 'secondary'"
                                size="sm"
                                @click="selectString(index)">
                                {{ string.note }}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DetectionStatus } from '@/types/tuner';

const {
    currentTuning,
    allTunings,
    activeStringIndex,
    currentFrequency,
    currentNote,
    deviation,
    isListening,
    detectionStatus,
    startListening,
    stopListening,
    selectString,
    playActiveString,
    addCustomTuning,
    selectTuning,
} = useTuner();

const isPlayingReference = ref<boolean>(false);

const stringGridLayouts: Record<number, string> = {
    1: 'grid grid-cols-1 gap-2', // 1 string: monochord
    2: 'grid grid-cols-2 gap-2', // 2 strings: dichord
    3: 'grid grid-cols-2 sm:grid-cols-3 gap-2', // 3 strings: balalaika, domra
    4: 'grid grid-cols-2 sm:grid-cols-4 gap-2', // 4 strings: ukulele, bass, violin
    5: 'grid grid-cols-2 sm:grid-cols-3 gap-2', // 5 strings: 5-string bass (3+2 layout)
    6: 'grid grid-cols-2 sm:grid-cols-3 gap-2', // 6 strings: standard guitar
    7: 'grid grid-cols-2 sm:grid-cols-4 gap-2', // 7 strings: 7-string guitar (4+3 layout)
    8: 'grid grid-cols-2 sm:grid-cols-4 gap-2', // 8 strings: 8-string guitar, mandolin
    9: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2', // 9 strings: theoretical
    10: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2', // 10+ strings: theoretical/custom
};

const gridLayoutClass = computed((): string => {
    const stringCount = currentTuning.value.strings.length;
    return stringGridLayouts[stringCount] || stringGridLayouts[10]!;
});

const stringsContainerClass = computed((): string => {
    const stringCount = currentTuning.value.strings.length;
    return stringCount < 6 ? 'justify-center' : '';
});

const getStringPositionClass = (index: number): string => {
    const stringCount = currentTuning.value.strings.length;

    switch (stringCount) {
        case 5: // 5-string bass: 3+2 layout with right alignment
            if (index === 3) return 'sm:col-start-2';
            if (index === 4) return 'sm:col-start-3';
            break;
        case 7: // 7-string guitar: 4+3 layout with right alignment
            if (index === 4) return 'sm:col-start-2';
            if (index === 5) return 'sm:col-start-3';
            if (index === 6) return 'sm:col-start-4';
            break;
        default:
            // No special positioning for other string counts
            break;
    }

    return '';
};

const toggleListening = async (): Promise<void> => {
    if (isListening.value) {
        stopListening();
    } else {
        try {
            await startListening();
        } catch (error) {
            alert('Please allow microphone access to use the tuner');
        }
    }
};

const playString = (index: number): void => {
    selectString(index);
    playActiveString();
    isPlayingReference.value = true;
    setTimeout((): void => {
        isPlayingReference.value = false;
    }, 1000);
};
</script>
