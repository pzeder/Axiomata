<template>
  <div class="edit-chapter">
    <TitleBar :title="chapter.title" :height=5 @editTitle="emit('editChapterTitle')" />
    <EditLevelList :levels="chapter.levels" @addNewLevel="addNewLevel" @deleteLevel="deleteLevel"
      @editLevelTitle="editLevelTitle" />
    <DeleteButton text="Kapitel löschen" @click="emit('deleteChapter')" />
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
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle', 'deleteChapter', 'addNewLevel', 'editLevelTitle', 'deleteLevel']);

function addNewLevel(levelIndex: number): void {
  emit('addNewLevel', levelIndex);
}

function editLevelTitle(levelIndex: number): void {
  emit('editLevelTitle', levelIndex);
}

function deleteLevel(levelIndex: number): void {
  emit('deleteLevel', levelIndex);
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