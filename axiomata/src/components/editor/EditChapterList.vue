<template>
  <div v-for="(chapter, index) in chapters" :key="index">
    <AddButton target="chapter" @click="addNewChapter(index)" />
    <EditChapter :chapter="chapter" :index="index" @editChapterTitle="editChapterTitle" @deleteChapter="deleteChapter"
      @addNewLevel="(lvlIndex) => addNewLevel(index, lvlIndex)" />
  </div>
  <AddButton target="chapter" @click="addNewChapter(chapters.length)" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData } from '@/scripts/Interfaces';
import axios from 'axios';
import EditChapter from './EditChapter.vue';
import AddButton from '@/components/editor/AddButton.vue';

interface Props {
  editID: any;
  chapters: ChapterData[];
}

const props = defineProps<Props>();

const emit = defineEmits(['updateChapters', 'editChapterTitle']);

function editChapterTitle(index: number) {
  emit('editChapterTitle', index);
}

async function addNewChapter(position: number): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      position: position
    }
    const response = await axios.post('http://localhost:3000/addNewChapter', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('New chapter added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function deleteChapter(index: number) {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: index
    }
    const response = await axios.patch('http://localhost:3000/deleteChapter', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('chapter deleted successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function addNewLevel(chapterIndex: number, levelIndex: number): Promise<void> {
  console.log(chapterIndex, levelIndex);
  /* try {
    const updateData = {
      editID: props.editID,
      chapterIndex: chapterIndex,
      levelIndex: levelIndex
    }
    const response = await axios.post('http://localhost:3000/addNewLevel', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('New chapter added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  } */
}

async function deleteLevel(index: number) {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: index
    }
    const response = await axios.patch('http://localhost:3000/deleteLevel', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('chapter deleted successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}
</script>

<style></style>