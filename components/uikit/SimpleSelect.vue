<template>
    <select
        :value="modelValue"
        :class="[
            'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white',
            { 'bg-gray-100 dark:bg-gray-600': disabled },
        ]"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
        <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
        </option>
    </select>
</template>

<script setup lang="ts">
interface SelectOption {
    value: string;
    label: string;
}

defineEmits<{
    'update:modelValue': [value: string];
}>();

withDefaults(
    defineProps<{
        modelValue: string;
        options: SelectOption[];
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);
</script>
