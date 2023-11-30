<template>
  <div class="edit-chapter">
    <TitleBar :title="chapter.title" target="chapter" :chapterIndex="index" :height=5
      @editChapterTitle="emit('editChapterTitle', index)" />
    <EditLevelList :levels="chapter.levels" @addNewLevel="addNewLevel" />
    <DeleteButton text="Kapitel löschen" @click="emit('deleteChapter', index)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from './TitleBar.vue';
import EditLevelList from './EditLevelList.vue';
import DeleteButton from './DeleteButton.vue';
import { ChapterData } from '@/scripts/Interfaces';

interface Props {
  chapter: ChapterData;
  index: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle', 'deleteChapter', 'addNewLevel']);

function addNewLevel(levelIndex: number): void {
  emit('addNewLevel', levelIndex);
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