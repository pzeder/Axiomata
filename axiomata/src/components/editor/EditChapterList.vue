<template>
  <div v-for="(chapter, index) in chapters" :key="index">
    <NewChapterButton @click="addNewChapter(index)" />
    <EditChapter :title="chapter.title" :index="index" @editChapterTitle="editChapterTitle" />
  </div>
  <NewChapterButton @click="addNewChapter(chapters.length)" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData } from '@/scripts/Interfaces';
import axios from 'axios';
import EditChapter from './EditChapter.vue';
import NewChapterButton from '@/components/editor/NewChapterButton.vue';

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
</script>

<style></style>