<template>
  <div class="edit-chapter">
    <TitleBar :title="title" target="chapter" :chapterIndex="index" @editChapterTitle="editChapterTitle" />
    <LevelList />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from './TitleBar.vue';
import LevelList from './LevelList.vue';

interface Props {
  title: string;
  index: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle']);

function editChapterTitle(index: number) {
  emit('editChapterTitle', index);
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