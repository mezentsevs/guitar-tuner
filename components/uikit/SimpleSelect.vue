<template>
    <div ref="containerRef" class="relative">
        <!-- Selected Value Display -->
        <button
            :id
            type="button"
            :name
            :class="[
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex justify-between items-center',
                disabled
                    ? 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer',
                { 'ring-2 ring-blue-500': isOpen && !disabled },
            ]"
            :disabled="disabled"
            @click="toggleDropdown"
            @keydown.escape="closeDropdown">
            <span class="truncate">{{ selectedLabel }}</span>
            <ChevronDownIcon
                class="w-5 h-5 transition-transform duration-200 shrink-0"
                :class="[
                    disabled
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-400 dark:text-gray-300',
                    { 'rotate-180': isOpen },
                ]" />
        </button>

        <!-- Dropdown Options -->
        <Transition name="dropdown">
            <div
                v-if="isOpen && !disabled"
                class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
                @click.stop>
                <div class="custom-scroll-container p-1">
                    <div
                        v-for="option in options"
                        :key="option.value"
                        :class="[
                            'px-3 py-2 cursor-pointer transition-colors flex items-center justify-between rounded-md',
                            {
                                'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400':
                                    isSelected(option.value),
                                'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100':
                                    !isSelected(option.value),
                            },
                        ]"
                        @click="selectOption(option)">
                        <div class="flex-1 truncate">{{ option.label }}</div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
interface SelectOption {
    value: string;
    label: string;
}

const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: SelectOption[];
        disabled?: boolean;
        id?: string;
        name?: string;
    }>(),
    {
        disabled: false,
        id: undefined,
        name: undefined,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref<boolean>(false);

const selectedLabel = computed((): string => {
    const selected = props.options.find(
        (option: SelectOption) => option.value === props.modelValue,
    );

    return selected?.label || '';
});

const isSelected = (value: string): boolean => {
    return value === props.modelValue;
};

const toggleDropdown = (): void => {
    if (!props.disabled) {
        isOpen.value = !isOpen.value;
    }
};

const closeDropdown = (): void => {
    isOpen.value = false;
};

const selectOption = (option: SelectOption): void => {
    emit('update:modelValue', option.value);
    closeDropdown();
};

const handleClickOutside = (event: MouseEvent): void => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        closeDropdown();
    }
};

onMounted((): void => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted((): void => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
