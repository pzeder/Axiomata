<template>
  <div class="chapter-container" v-for="(chapter, chIndex) in chapters" :key="chIndex">
    {{ chapter.title }}
    <div class="level-container" v-for="(level, lvlIndex) in chapter.levels" :key="lvlIndex"
      @click="trySelectingLevel(chIndex, lvlIndex)"
      :style="{ backgroundColor: (isCurrentLevel(chIndex, lvlIndex) ? '#F5AA27' : (level.solved ? '#3FB56E'  : 'rgb(150,150,150)')) }">
      {{ level.title }}
    </div>
  </div>
  <button :style="{ fontSize: 20 + 'pt' }" @click="emit('openSaveStateMenu')"> Ladebidschirm </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import { ChapterData, LevelData } from '@/scripts/Interfaces';

interface Props {
  chapters: ChapterData[] | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel', 'updateChapters', 'openSaveStateMenu', 'openStartMenu']);

interface LevelPointer {
  chapterIndex: number;
  levelIndex: number
}

const currentLevel: ComputedRef<LevelPointer | null> = computed(() => {
  if (!props.chapters) {
    return null;
  }
  for (let ch = 0; ch < props.chapters.length; ch++) {
    let chapter: ChapterData = props.chapters[ch];
    for (let lvl = 0; lvl < chapter.levels.length; lvl++) {
      let level: LevelData = chapter.levels[lvl];
      if (!level.solved) {
        return {
        chapterIndex: ch,
        levelIndex: lvl
        };
      }
    }
  }
  return null;
});

function trySelectingLevel(chapterIndex: number, levelIndex: number) {
  if (isCurrentLevel(chapterIndex, levelIndex)) {
    emit('openLevel');
  }
}

function isCurrentLevel(chapterIndex: number, levelIndex: number): boolean {
  return currentLevel.value?.chapterIndex === chapterIndex && currentLevel.value?.levelIndex === levelIndex;
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