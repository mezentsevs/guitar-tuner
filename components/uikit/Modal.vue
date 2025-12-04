<template>
    <Transition name="modal">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
                @click="$emit('close')" />
            <div
                class="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] custom-scroll-container transition-colors duration-300">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            <slot name="title" />
                        </h3>
                        <button
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            @click="$emit('close')">
                            <CloseIcon class="w-5 h-5" />
                        </button>
                    </div>
                    <div class="text-gray-600 dark:text-gray-400">
                        <slot />
                    </div>
                    <div v-if="$slots.actions" class="flex gap-3 justify-end mt-6">
                        <slot name="actions" />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineEmits<{
    close: [];
}>();

defineProps<{
    isOpen: boolean;
}>();
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
