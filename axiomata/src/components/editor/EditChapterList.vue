<template>
  <div v-for="(chapter, index) in chapters" :key="index">
    <NewChapterButton @click="addNewChapter(index)" />
    <div class="edit-chapter">
      <TitleBar :title="chapter.title" target="chapter" :chapterIndex="index" @editChapterTitle="editChapterTitle" />
      <LevelList />
    </div>
  </div>
  <NewChapterButton @click="addNewChapter(chapters.length)" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData } from '@/scripts/Interfaces';
import axios from 'axios';
import TitleBar from './TitleBar.vue';
import LevelList from '@/components/editor/LevelList.vue';
import NewChapterButton from '@/components/editor/NewChapterButton.vue';

interface Props {
  editID: any;
  chapters: ChapterData[];
}

const props = defineProps<Props>();

const emit = defineEmits(['updateChapters', 'editChapterTitle']);

function editChapterTitle(index: number) {
  emit('editChapterTitle', index)
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

<style>
.edit-chapter {
  width: 100vw;
  border: 2px solid black;
  border-radius: 1vw;
  margin-bottom: 10px;
  font-size: 20pt;
  user-select: none;
}
</style>