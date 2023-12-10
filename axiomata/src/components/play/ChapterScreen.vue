<template>
  <HomeButton @click="emit('openStartMenu')" />
  <div class="chapter-container" v-for="(chapter, chIndex) in chapters" :key="chIndex">
    {{ chapter.title }}
    <div class="level-container" v-for="(level, lvlIndex) in chapter.levels" :key="lvlIndex"
      @click="emit('openLevel', chIndex, lvlIndex)"
      :style="{ backgroundColor: (isFrontLevel(chIndex, lvlIndex) ? '#F5AA27' : (level.solved ? '#3FB56E' : 'rgb(150,150,150)')) }">
      {{ level.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ChapterData, LevelPointer } from '@/scripts/Interfaces';
import HomeButton from '../menus/HomeButton.vue';

interface Props {
  chapters: ChapterData[] | undefined;
  frontLevelPointer: LevelPointer | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel', 'openStartMenu']);


function isFrontLevel(chapterIndex: number, levelIndex: number): boolean {
  return props.frontLevelPointer?.chapterIndex === chapterIndex && props.frontLevelPointer?.levelIndex === levelIndex;
}
</script>

<style>
.chapter-container {
  position: static;
  display: flex;
  flex-direction: column;
  font-size: 50pt;
  margin-bottom: 10px;
  user-select: none;
}

.level-container {
  display: grid;
  place-items: center;
  width: 100%;
  height: 10vh;
  border: 0.3vw solid black;
  border-radius: 2vw;
  margin-bottom: 10px;
  font-size: 30pt;
  user-select: none;
}
</style>