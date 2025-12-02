<template>
    <button
        class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        aria-label="Toggle theme"
        @click="toggleTheme">
        <ThemeDarkIcon v-if="theme === 'light'" class="w-5 h-5" />
        <ThemeLightIcon v-else class="w-5 h-5" />
    </button>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme();
</script>
