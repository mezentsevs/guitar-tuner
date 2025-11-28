<template>
  <div
    class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300"
    :class="{
      'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20': isActive,
      'scale-105': isActive && isPlaying,
    }"
  >
    <!-- String Info -->
    <div class="text-center mb-4">
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ string.note }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ string.frequency.toFixed(2) }} Hz
      </div>
    </div>

    <!-- Deviation Indicator -->
    <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-200"
        :style="{
          transform: `translateX(${deviationPosition}%)`,
          width: '4px',
        }"
      />
    </div>

    <!-- Cent Display -->
    <div class="text-lg font-semibold mb-4" :class="centColor">
      {{ deviation > 0 ? '+' : '' }}{{ deviation }}¢
    </div>

    <!-- Play Button -->
    <Button
      size="sm"
      variant="secondary"
      @click="$emit('play')"
      class="transition-transform hover:scale-105"
    >
      <IconPlay class="w-4 h-4" />
    </Button>

    <!-- Status Indicator -->
    <div class="mt-2 w-3 h-3 rounded-full transition-colors duration-300" :class="statusColor" />
  </div>
</template>

<script setup lang="ts">
import { DetectionStatus, type GuitarString } from '@/types/tuner'

defineEmits<{
  play: []
}>()

const props = defineProps<{
  string: GuitarString
  deviation: number
  status: DetectionStatus
  isActive: boolean
  isPlaying: boolean
}>()

const deviationPosition = computed((): number => {
  return Math.max(-50, Math.min(50, props.deviation / 2)) + 50
})

const centColor = computed((): string => {
  switch (props.status) {
    case DetectionStatus.InTune:
      return 'text-green-600 dark:text-green-400'
    case DetectionStatus.TooLow:
      return 'text-blue-600 dark:text-blue-400'
    case DetectionStatus.TooHigh:
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const statusColor = computed((): string => {
  switch (props.status) {
    case DetectionStatus.InTune:
      return 'bg-green-500'
    case DetectionStatus.TooLow:
      return 'bg-blue-500'
    case DetectionStatus.TooHigh:
      return 'bg-red-500'
    default:
      return 'bg-gray-400 dark:bg-gray-500'
  }
})
</script>
