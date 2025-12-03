<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-8 lg:py-8 lg:flex lg:items-center px-4 transition-colors duration-300">
        <div class="max-w-6xl mx-auto w-full">
            <!-- Header -->
            <div class="text-center mb-8 relative">
                <div class="absolute top-0 right-0">
                    <ThemeToggle />
                </div>
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Guitar Tuner</h1>
                <p class="text-gray-700 dark:text-gray-400">
                    Professional tuning with real-time audio analysis
                </p>
            </div>

            <!-- Main Content -->
            <div class="grid lg:grid-cols-4 gap-8 justify-center lg:items-stretch">
                <!-- Tuning Controls -->
                <div
                    class="lg:col-span-1 space-y-6 lg:space-y-0 lg:flex lg:flex-col lg:gap-6 lg:h-full">
                    <!-- Tuning Selector -->
                    <div
                        class="lg:flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-sm border border-gray-200 dark:border-none p-6 transition-colors duration-300 flex flex-col">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Tuning
                        </h2>
                        <div class="flex-1">
                            <div class="space-y-4 w-full">
                                <ClientOnly>
                                    <TuningSelector
                                        :tunings="allTunings"
                                        :current-tuning-id="currentTuning.id"
                                        @select-tuning="selectTuning"
                                        @add-custom-tuning="addCustomTuning"
                                        @update-custom-tuning="updateCustomTuning"
                                        @delete-custom-tuning="deleteCustomTuning" />
                                </ClientOnly>
                            </div>
                        </div>
                    </div>

                    <!-- Controls -->
                    <div
                        class="lg:flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-sm border border-gray-200 dark:border-none p-6 transition-colors duration-300 flex flex-col">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Controls
                        </h2>
                        <div class="flex-1">
                            <div class="space-y-4 w-full">
                                <Button
                                    :variant="isListening ? 'danger' : 'primary'"
                                    class="w-full h-10"
                                    @click="toggleListening">
                                    <MicrophoneIcon class="w-4 h-4 mr-2" />
                                    {{ isListening ? 'Stop' : 'Start' }}
                                </Button>

                                <Button
                                    variant="secondary"
                                    class="w-full h-10"
                                    @click="playActiveString">
                                    <PlayIcon class="w-4 h-4 mr-2" />
                                    Play
                                </Button>
                            </div>
                        </div>
                    </div>

                    <!-- Frequency Display -->
                    <div
                        class="lg:flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-sm border border-gray-200 dark:border-none p-6 transition-colors duration-300 flex flex-col">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Input
                        </h2>
                        <div class="flex-1 flex items-center justify-center">
                            <div
                                v-if="currentFrequency > 0"
                                class="space-y-2 w-full transition-all duration-300 ease-in-out text-center -mt-4">
                                <div class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ currentFrequency.toFixed(2) }} Hz
                                </div>
                                <div class="text-xl text-gray-700 dark:text-gray-400">
                                    {{ currentNote }}
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex flex-col items-center text-gray-400 animate-pulse space-y-3 w-full -mt-4">
                                <WaveIcon class="w-10 h-10 opacity-60" />
                                <p class="text-sm">Start tuning</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Strings Grid -->
                <div class="lg:col-span-3 lg:h-full">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-sm border border-gray-200 dark:border-none p-6 transition-colors duration-300 flex flex-col min-h-[500px] lg:min-h-0 lg:h-full w-full">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Strings
                        </h2>

                        <div class="flex-1 flex items-center justify-center">
                            <div
                                :class="[gridLayoutClass, containerMinWidthClass]"
                                class="w-fit mx-auto">
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
                                    @select="selectString(index)"
                                    @play="playString(index)" />
                            </div>
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
    updateCustomTuning,
    deleteCustomTuning,
    selectTuning,
} = useTuner();

const isPlayingReference = ref<boolean>(false);

const stringGridLayouts: Record<number, string> = {
    1: 'grid grid-cols-1 gap-4 justify-items-center',
    2: 'grid grid-cols-2 gap-4',
    3: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
    4: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
    5: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
    6: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
    7: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
    8: 'grid grid-cols-2 sm:grid-cols-4 gap-4',
    9: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4',
    10: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4',
};

const gridLayoutClass = computed((): string => {
    const stringCount = currentTuning.value.strings.length;
    return stringGridLayouts[stringCount] || stringGridLayouts[10]!;
});

const containerMinWidthClass = computed((): string => {
    return currentTuning.value.strings.length === 1 ? 'min-w-0' : 'min-w-[336px] sm:min-w-0';
});

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
