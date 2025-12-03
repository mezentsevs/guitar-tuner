<template>
    <div ref="containerRef" class="relative">
        <!-- Selected Value Display -->
        <button
            :id
            type="button"
            :name
            :class="[
                'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white text-left flex justify-between items-center',
                { 'ring-2 ring-blue-500': isOpen },
            ]"
            @click="toggleDropdown"
            @keydown.escape="closeDropdown">
            <span class="truncate">{{ selectedLabel }}</span>
            <ChevronDownIcon
                class="w-5 h-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }" />
        </button>

        <!-- Dropdown Options -->
        <Transition name="dropdown">
            <div
                v-if="isOpen"
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
                        <div v-if="hasActions(option.value)" class="flex items-center gap-1 ml-2">
                            <slot name="action" :option />
                        </div>
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

interface ActionChecker {
    (value: string): boolean;
}

const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: SelectOption[];
        hasActions?: boolean | ActionChecker;
        id?: string;
        name?: string;
    }>(),
    {
        hasActions: false,
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

const hasActions = (value: string): boolean => {
    if (typeof props.hasActions === 'function') {
        return props.hasActions(value);
    }

    return props.hasActions;
};

const toggleDropdown = (): void => {
    isOpen.value = !isOpen.value;
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
