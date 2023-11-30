<template>
  <div class="edit-chapter">
    <TitleBar :title="title" target="chapter" :chapterIndex="index" @editChapterTitle="emit('editChapterTitle', index)" />
    <LevelList />
    <DeleteButton text="Kapitel löschen" @click="emit('deleteChapter', index)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from './TitleBar.vue';
import LevelList from './LevelList.vue';
import DeleteButton from './DeleteButton.vue';

interface Props {
  title: string;
  index: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle', 'deleteChapter']);
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