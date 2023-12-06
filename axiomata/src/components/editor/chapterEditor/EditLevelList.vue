<template>
  <div v-for="(level, index) in levels" :key="index">
    <AddButton target="level" @click="addNewLevel(index)" />
    <EditLevel :level="level" @editLevelTitle="editLevelTitle(index)" @deleteLevel="emit('deleteLevel', index)"
      @click="emit('editGoalAxiom', index)" />
  </div>
  <AddButton target="level" @click="emit('addNewLevel', levels.length)" />
  <AxiomEditor v-if="showAxiomEditor" :editID="editID" :level="editLevel" :symbols="course?.symbols"
    @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" />
</template>

<script setup lang="ts">
import { ChapterData, LevelData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref } from 'vue';
import AddButton from '@/components/editor/AddButton.vue'
import EditLevel from './EditLevel.vue'
import axios from 'axios';

interface Props {
  editID: any;
  levels: LevelData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['updateSymbols']);

const showAxiomEditor: Ref<boolean> = ref(false);

async function addNewLevel(chapterIndex: number, levelIndex: number): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: chapterIndex,
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

async function deleteLevel(chapterIndex: number, levelIndex: number) {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: chapterIndex,
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
</script>