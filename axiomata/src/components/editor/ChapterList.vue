<template>
  <div class="chapter-container" v-for="(chapter, index) in chapters" :key="index"> {{ chapter.title }} </div>
  <div class="new-chapter-button" @click="emit('addNewChapter')"> Neues Kapitel hinzufügen </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData } from '@/scripts/Interfaces';

interface Props {
  chapters: ChapterData[];
}

const props = defineProps<Props>();

const emit = defineEmits(['addNewChapter']);
</script>

<style>
.chapter-container {
  width: 100vw;
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