<template>
  <div class="edit-chapter" v-for="(chapter, index) in chapters" :key="index">
    <TitleBar :title="chapter.title" target="chapter" :chapterIndex="index" @editChapterTitle="editChapterTitle" />
    <LevelList />
  </div>
  <div class="new-chapter-button" @click="addNewChapter"> Neues Kapitel hinzufügen </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData } from '@/scripts/Interfaces';
import axios from 'axios';
import TitleBar from './TitleBar.vue';
import LevelList from '@/components/editor/LevelList.vue';

interface Props {
  editID: any;
  chapters: ChapterData[];
}

const props = defineProps<Props>();

const emit = defineEmits(['updateChapters', 'editChapterTitle']);

function editChapterTitle(index: number) {
  emit('editChapterTitle', index)
}

async function addNewChapter(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/addNewChapter' + query);
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

.new-chapter-button {
  width: 50vw;
  height: 10vh;
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20pt;
  user-select: none;
}
</style>