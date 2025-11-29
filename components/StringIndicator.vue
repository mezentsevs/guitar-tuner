<template>
    <div
        class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300"
        :class="{
            'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/10': isActive,
            'scale-105': isActive && isPlaying,
        }">
        <!-- String Info -->
        <div class="text-center mb-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ string.note }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ string.frequency.toFixed(2) }} Hz
            </div>
        </div>

        <!-- Deviation Indicator -->
        <div class="w-32 h-3 bg-gray-900 rounded-full mb-4 relative overflow-hidden shadow-inner">
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
                class="absolute top-0 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 transition-all duration-150 border-2 border-white shadow-md dark:shadow-lg dark:shadow-green-400"
                :style="{ left: `${deviationPosition}%` }" />
        </div>

        <!-- Cent Display -->
        <div class="text-lg font-semibold mb-4 font-mono" :class="centColor">
            {{ deviation > 0 ? '+' : '' }}{{ deviation }}
        </div>

        <!-- Play Button -->
        <Button
            size="sm"
            variant="secondary"
            class="transition-transform hover:scale-105"
            @click="$emit('play')">
            <PlayIcon class="w-4 h-4" />
        </Button>

        <!-- Status Indicator -->
        <div
            class="mt-2 w-3 h-3 rounded-full transition-colors duration-300"
            :class="statusColor" />
    </div>
</template>

<script setup lang="ts">
import { DetectionStatus, type GuitarString } from '@/types/tuner';

defineEmits<{
    play: [];
}>();

const props = defineProps<{
    string: GuitarString;
    deviation: number;
    status: DetectionStatus;
    isActive: boolean;
    isPlaying: boolean;
}>();

const deviationPosition = computed((): number => {
    const clamped: number = Math.max(-50, Math.min(50, props.deviation));

    return ((clamped + 50) / 100) * 100;
});

const centColor = computed((): string => {
    switch (props.status) {
        case DetectionStatus.InTune:
            return 'text-green-500 dark:drop-shadow-[0_0_3px_rgba(34,197,94,0.5)] dark:drop-shadow-[0_0_6px_rgba(34,197,94,0.3)]';
        case DetectionStatus.TooLow:
            return 'text-blue-500 dark:drop-shadow-[0_0_3px_rgba(59,130,246,0.5)] dark:drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]';
        case DetectionStatus.TooHigh:
            return 'text-red-500 dark:drop-shadow-[0_0_3px_rgba(239,68,68,0.5)] dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]';
        default:
            return 'text-gray-400';
    }
});

const statusColor = computed((): string => {
    switch (props.status) {
        case DetectionStatus.InTune:
            return 'bg-green-500 shadow dark:shadow-[0_0_6px_rgba(34,197,94,0.5)] dark:shadow-[0_0_12px_rgba(34,197,94,0.3)]';
        case DetectionStatus.TooLow:
            return 'bg-blue-500 shadow dark:shadow-[0_0_6px_rgba(59,130,246,0.5)] dark:shadow-[0_0_12px_rgba(59,130,246,0.3)]';
        case DetectionStatus.TooHigh:
            return 'bg-red-500 shadow dark:shadow-[0_0_6px_rgba(239,68,68,0.5)] dark:shadow-[0_0_12px_rgba(239,68,68,0.3)]';
        default:
            return 'bg-gray-400 dark:bg-gray-500 shadow';
    }
});
</script>
