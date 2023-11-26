<template>
  <div class="chapter-container" v-for="(chapter, index) in chapters" :key="index">
    <div> {{ chapter.title }}</div>
    <div> Neues Level hinzufügen </div>
    <input type="text" id="textInput" placeholder="Enter text here">
  </div>
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
  border-radius: 1vw;
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

#textInput {
  width: 300px;
  /* Width of the text bar */
  padding: 10px;
  /* Padding inside the text bar */
  margin: 10px;
  /* Margin around the text bar */
  border: 1px solid #ccc;
  /* Border of the text bar */
  border-radius: 4px;
  /* Rounded corners for the text bar */
}</style>