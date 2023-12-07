<template>
  <div v-for="(level, index) in levels" :key="index">
    <AddButton target="level" @click="addNewLevel(index)" />
    <EditLevel :level="level" :symbols="symbols" @editLevelTitle="editLevelTitle(index)" @deleteLevel="deleteLevel(index)"
      @editGoalAxiom="editGoalAxiom(index)" />
  </div>
  <AddButton target="level" @click="addNewLevel(levels.length)" />
  <AxiomEditor v-if="showAxiomEditor" :editID="editID" :axiom="editLevel?.goalAxiom" :symbols="symbols" upTitle="START"
    lowTitle="ZIEL" @updateChapters="(updatedChapters) => emit('updateChapters', updatedChapters)"
    @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" @closeAxiomEditor="showAxiomEditor = false"
    @saveAxiom="updateGoalAxiom" />
  <TextInput v-if="showTextInput" title="Titel des Levels ändern" :placeholder="editLevel?.title"
    @updateText="updateLevelTitle" @click="showTextInput = false" />
</template>

<script setup lang="ts">
import { AxiomData, ChapterData, LevelData, SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import AddButton from '@/components/editor/AddButton.vue'
import EditLevel from './EditLevel.vue'
import AxiomEditor from '../axiomEditor/AxiomEditor.vue';
import TextInput from '../TextInput.vue';
import axios from 'axios';

interface Props {
  editID: any;
  chapterIndex: number;
  levels: LevelData[];
  symbols: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['updateSymbols', 'updateChapters']);

const showAxiomEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const editLevelIndex: Ref<number> = ref(-1);
const editLevel: ComputedRef<LevelData | null> = computed(() => {
  if (editLevelIndex.value === -1) {
    return null;
  }
  return props.levels[editLevelIndex.value];
});

async function addNewLevel(levelIndex: number): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: props.chapterIndex,
      levelIndex: levelIndex
    }
    const response = await axios.post('http://localhost:3000/addNewLevel', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('New Level added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function deleteLevel(levelIndex: number) {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: props.chapterIndex,
      levelIndex: levelIndex
    }
    const response = await axios.patch('http://localhost:3000/deleteLevel', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('level deleted successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function updateLevelTitle(text: string): Promise<void> {
  showTextInput.value = false;
  if (text.length === 0) {
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      text: text,
      chapterIndex: props.chapterIndex,
      levelIndex: editLevelIndex.value
    };
    const response = await axios.patch('http://localhost:3000/levelTitle', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateGoalAxiom(goalAxiom: AxiomData): Promise<void> {
  showAxiomEditor.value = false;
  try {
    const updateData = {
      editID: props.editID,
      goalAxiom: goalAxiom,
      chapterIndex: props.chapterIndex,
      levelIndex: editLevelIndex.value
    };
    const response = await axios.patch('http://localhost:3000/goalAxiom', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



function editLevelTitle(levelIndex: number) {
  editLevelIndex.value = levelIndex;
  showTextInput.value = true;
}

function editGoalAxiom(levelIndex: number) {
  editLevelIndex.value = levelIndex;
  showAxiomEditor.value = true;
}
</script>