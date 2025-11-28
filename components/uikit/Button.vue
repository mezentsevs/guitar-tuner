<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600'
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3'
}
</script>
