<template>
    <div class="space-y-4">
        <!-- Custom Select with Actions -->
        <ActionSelect
            :model-value="currentTuningId"
            :options="tuningOptions"
            :has-actions="isCustomTuning"
            @update:model-value="selectTuning">
            <template #action="{ option }">
                <button
                    class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                    aria-label="Edit tuning"
                    @click.stop="editTuningFromOption(option.value)">
                    <EditIcon class="w-4 h-4" />
                </button>
                <button
                    class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    aria-label="Delete tuning"
                    @click.stop="confirmDeleteTuningFromOption(option.value)">
                    <DeleteIcon class="w-4 h-4" />
                </button>
            </template>
        </ActionSelect>

        <!-- Add Custom Tuning -->
        <Button variant="secondary" class="w-full h-10" @click="showAddModal = true">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add
        </Button>

        <!-- Add/Edit Custom Tuning Modal -->
        <Modal :is-open="showModal" @close="closeModal">
            <template #title>{{ modalMode === 'add' ? 'Add' : 'Edit' }} Custom Tuning</template>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tuning Name
                    </label>
                    <input
                        v-model="editingTuning.name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        placeholder="e.g., Open G" />
                </div>

                <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Strings</div>
                    <div
                        v-for="(string, index) in editingTuning.strings"
                        :key="index"
                        class="flex gap-2 items-center">
                        <SimpleSelect
                            :model-value="string.note"
                            :options="noteOptions"
                            class="w-20"
                            @update:model-value="updateStringNote(index, $event)" />
                        <input
                            v-model.number="string.frequency"
                            type="number"
                            step="0.01"
                            min="1"
                            class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            placeholder="Frequency" />
                        <Button
                            v-if="editingTuning.strings.length > 1"
                            variant="danger"
                            size="sm"
                            @click="removeString(index)">
                            <CloseIcon class="w-3 h-3" />
                        </Button>
                    </div>
                </div>

                <Button variant="secondary" class="w-full h-10" @click="addString">
                    Add String
                </Button>
            </div>

            <template #actions>
                <Button variant="secondary" @click="closeModal">Cancel</Button>
                <Button :disabled="!isValidTuning" @click="saveTuning">Save</Button>
            </template>
        </Modal>

        <!-- Delete Confirmation Modal -->
        <Modal :is-open="showDeleteModal" @close="showDeleteModal = false">
            <template #title>Delete Tuning</template>

            <div class="space-y-4">
                <p class="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete "{{ deletingTuning?.name }}"?
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone.
                </p>
            </div>

            <template #actions>
                <Button variant="secondary" @click="showDeleteModal = false">Cancel</Button>
                <Button variant="danger" @click="executeDelete">Delete</Button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { Note, NoteNames, TuningPresets, type Tuning, type GuitarString } from '@/types/tuner';

interface SelectOption {
    value: string;
    label: string;
}

const createEmptyTuning = (): Tuning => {
    return {
        id: `${TuningPresets.CustomPrefix}${Date.now()}`,
        name: '',
        strings: Array(TuningPresets.DefaultStringCount)
            .fill(null)
            .map(
                (): GuitarString => ({
                    note: Note.E,
                    frequency: 0,
                }),
            ),
    };
};

const props = defineProps<{
    tunings: readonly Tuning[];
    currentTuningId: string;
}>();

const emit = defineEmits<{
    selectTuning: [id: string];
    addCustomTuning: [tuning: Tuning];
    updateCustomTuning: [id: string, tuning: Tuning];
    deleteCustomTuning: [id: string];
}>();

const showAddModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);

const modalMode = ref<'add' | 'edit'>('add');
const editingTuning = ref<Tuning>(createEmptyTuning());
const deletingTuning = ref<Tuning | null>(null);

const tuningOptions = computed((): SelectOption[] => {
    return props.tunings.map((tuning: Tuning) => ({
        value: tuning.id,
        label: tuning.name,
    }));
});

const noteOptions = computed((): SelectOption[] => {
    return NoteNames.map((note: Note) => ({
        value: note,
        label: note,
    }));
});

const isCustomTuning = (id: string): boolean => {
    return id.startsWith(TuningPresets.CustomPrefix);
};

const showModal = computed((): boolean => {
    return showAddModal.value || modalMode.value === 'edit';
});

const isValidTuning = computed((): boolean => {
    return (
        editingTuning.value.name.trim() !== '' &&
        editingTuning.value.strings.length > 0 &&
        editingTuning.value.strings.every((s: GuitarString) => {
            return s.note && s.frequency > 0;
        })
    );
});

const selectTuning = (id: string): void => {
    emit('selectTuning', id);
};

const editTuningFromOption = (tuningId: string): void => {
    const tuning = props.tunings.find((t: Tuning) => t.id === tuningId);
    if (tuning) {
        editTuning(tuning);
    }
};

const editTuning = (tuning: Tuning): void => {
    modalMode.value = 'edit';
    editingTuning.value = {
        id: tuning.id,
        name: tuning.name,
        strings: tuning.strings.map((string: GuitarString) => ({ ...string })),
    };
    showAddModal.value = true;
};

const confirmDeleteTuningFromOption = (tuningId: string): void => {
    const tuning = props.tunings.find((t: Tuning) => t.id === tuningId);
    if (tuning) {
        confirmDeleteTuning(tuning);
    }
};

const confirmDeleteTuning = (tuning: Tuning): void => {
    deletingTuning.value = tuning;
    showDeleteModal.value = true;
};

const executeDelete = (): void => {
    if (deletingTuning.value) {
        emit('deleteCustomTuning', deletingTuning.value.id);
        showDeleteModal.value = false;
        deletingTuning.value = null;
    }
};

const addString = (): void => {
    editingTuning.value.strings.push({ note: Note.E, frequency: 0 });
};

const removeString = (index: number): void => {
    if (editingTuning.value.strings.length > 1) {
        editingTuning.value.strings.splice(index, 1);
    }
};

const updateStringNote = (index: number, note: string): void => {
    editingTuning.value.strings[index]!.note = note as Note;
};

const saveTuning = (): void => {
    if (!isValidTuning.value) {
        return;
    }

    const tuningToSave: Tuning = {
        id: editingTuning.value.id,
        name: editingTuning.value.name.trim(),
        strings: editingTuning.value.strings.map((string: GuitarString) => ({
            note: string.note,
            frequency: Number(string.frequency),
        })),
    };

    if (modalMode.value === 'add') {
        emit('addCustomTuning', tuningToSave);
    } else {
        emit('updateCustomTuning', tuningToSave.id, tuningToSave);
    }

    closeModal();
};

const closeModal = (): void => {
    showAddModal.value = false;
    modalMode.value = 'add';
    editingTuning.value = createEmptyTuning();
};
</script>
