<template>
    <div
        class="flex flex-col items-center p-3 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:scale-105 w-full max-w-[150px] mx-auto"
        :class="[
            baseCardClass,
            {
                'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20':
                    isActive && status === DetectionStatus.TooLow,
                'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20':
                    isActive && status === DetectionStatus.InTune,
                'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20':
                    isActive && status === DetectionStatus.TooHigh,
                'ring-2 ring-gray-300 bg-gray-50 dark:ring-gray-500 dark:bg-gray-800':
                    isActive && status === DetectionStatus.Unstable,
                'scale-105': isActive && isPlaying,
            },
        ]"
        @click="$emit('select')">
        <!-- String Info -->
        <div class="text-center mb-3 w-full">
            <div class="text-xl font-bold text-gray-900 dark:text-white truncate">
                {{ string.note }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ string.frequency.toFixed(2) }} Hz
            </div>
        </div>

        <!-- Deviation Indicator -->
        <div class="w-full h-3 bg-gray-900 rounded-full mb-3 relative overflow-hidden shadow-inner">
            <!-- Background Gradient -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-90" />

            <!-- Grid Pattern -->
            <div
                class="absolute inset-0 opacity-20 bg-[length:10px_100%] bg-gradient-to-r from-transparent via-white to-transparent"
                :style="{
                    backgroundImage:
                        'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.3) 50%)',
                }" />

            <!-- Center Marker -->
            <div
                class="absolute left-1/2 top-0 w-0.5 h-3 bg-white transform -translate-x-1/2 shadow-lg shadow-green-400 dark:shadow-green-400" />

            <!-- Moving Indicator -->
            <div
                class="absolute top-0 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 transition-all duration-200 border-2 border-white shadow-md dark:shadow-lg"
                :class="indicatorShadow"
                :style="{ left: `${deviationPosition}%` }" />
        </div>

        <!-- Cent Display -->
        <div class="text-base font-semibold mb-3 font-mono" :class="centColor">
            {{ deviation > 0 ? '+' : '' }}{{ deviation }}
        </div>

        <!-- Play Button -->
        <Button
            size="sm"
            variant="secondary"
            class="transition-transform duration-200 hover:scale-105"
            @click="handlePlayClick">
            <PlayIcon class="w-4 h-4" />
        </Button>
    </div>
</template>

<script setup lang="ts">
import { DetectionStatus, type GuitarString } from '@/types/tuner';

const emit = defineEmits<{
    select: [];
    play: [];
}>();

const props = defineProps<{
    string: GuitarString;
    deviation: number;
    status: DetectionStatus;
    isActive: boolean;
    isPlaying: boolean;
}>();

const handlePlayClick = (event: MouseEvent): void => {
    event.stopPropagation();
    emit('play');
};

const baseCardClass = computed((): string => {
    return props.isActive
        ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 shadow-lg'
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm';
});

const deviationPosition = computed((): number => {
    const clamped: number = Math.max(-50, Math.min(50, props.deviation));
    return ((clamped + 50) / 100) * 100;
});

const centColor = computed((): string => {
    const absDeviation: number = Math.abs(props.deviation);

    if (absDeviation <= 20) {
        return 'text-green-600 dark:text-green-400';
    } else if (props.deviation < 0) {
        return 'text-blue-600 dark:text-blue-400';
    } else {
        return 'text-red-600 dark:text-red-400';
    }
});

const indicatorShadow = computed((): string => {
    switch (props.status) {
        case DetectionStatus.InTune:
            return 'shadow-green-400';
        case DetectionStatus.TooLow:
            return 'shadow-blue-400';
        case DetectionStatus.TooHigh:
            return 'shadow-red-400';
        default:
            return 'shadow-gray-400';
    }
});
</script>
