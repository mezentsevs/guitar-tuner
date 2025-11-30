<template>
    <div class="space-y-4">
        <!-- Preset Tunings -->
        <Select
            :model-value="currentTuningId"
            :options="tuningOptions"
            @update:model-value="selectTuning" />

        <!-- Custom Tunings -->
        <div v-if="customTunings.length > 0" class="space-y-2">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Tunings</div>
            <div class="flex flex-wrap gap-2">
                <Button
                    v-for="tuning in customTunings"
                    :key="tuning.id"
                    variant="secondary"
                    size="sm"
                    @click="selectTuning(tuning.id)">
                    {{ tuning.name }}
                </Button>
            </div>
        </div>

        <!-- Add Custom Tuning -->
        <Button variant="secondary" class="w-full h-10" @click="showCustomModal = true">
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Custom Tuning
        </Button>

        <!-- Custom Tuning Modal -->
        <Modal :is-open="showCustomModal" @close="showCustomModal = false">
            <template #title>Add Custom Tuning</template>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tuning Name
                    </label>
                    <input
                        v-model="newTuning.name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        placeholder="e.g., Open G" />
                </div>

                <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Strings</div>
                    <div
                        v-for="(string, index) in newTuning.strings"
                        :key="index"
                        class="flex gap-2 items-center">
                        <Select
                            :model-value="string.note"
                            :options="noteOptions"
                            class="w-20"
                            @update:model-value="updateStringNote(index, $event)" />
                        <input
                            v-model.number="string.frequency"
                            type="number"
                            step="0.01"
                            class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                            placeholder="Frequency" />
                        <Button
                            v-if="newTuning.strings.length > 1"
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
                <Button variant="secondary" @click="showCustomModal = false">Cancel</Button>
                <Button :disabled="!isValidTuning" @click="saveCustomTuning">Save</Button>
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

const props = defineProps<{
    tunings: readonly Tuning[];
    currentTuningId: string;
    customTunings: readonly Tuning[];
}>();

const emit = defineEmits<{
    selectTuning: [id: string];
    addCustomTuning: [tuning: Tuning];
}>();

const showCustomModal = ref<boolean>(false);

const newTuning = ref<Omit<Tuning, 'id'>>({
    name: '',
    strings: Array(TuningPresets.DefaultStringCount)
        .fill(null)
        .map(
            (): GuitarString => ({
                note: Note.E,
                frequency: 0,
            }),
        ),
});

const tuningOptions = computed((): SelectOption[] =>
    props.tunings.map((tuning: Tuning) => ({
        value: tuning.id,
        label: tuning.name,
    })),
);

const noteOptions = computed((): SelectOption[] =>
    NoteNames.map((note: Note) => ({
        value: note,
        label: note,
    })),
);

const isValidTuning = computed((): boolean => {
    return (
        newTuning.value.name.trim() !== '' &&
        newTuning.value.strings.length > 0 &&
        newTuning.value.strings.every((s: GuitarString) => s.note && s.frequency > 0)
    );
});

const selectTuning = (id: string): void => {
    emit('selectTuning', id);
};

const addString = (): void => {
    newTuning.value.strings.push({ note: Note.E, frequency: 0 });
};

const removeString = (index: number): void => {
    newTuning.value.strings.splice(index, 1);
};

const updateStringNote = (index: number, note: string): void => {
    newTuning.value.strings[index]!.note = note as Note;
};

const saveCustomTuning = (): void => {
    if (!isValidTuning.value) return;

    const tuning: Tuning = {
        id: `${TuningPresets.CustomPrefix}${Date.now()}`,
        name: newTuning.value.name,
        strings: [...newTuning.value.strings],
    };

    emit('addCustomTuning', tuning);
    showCustomModal.value = false;
    resetNewTuning();
};

const resetNewTuning = (): void => {
    newTuning.value = {
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
</script>
