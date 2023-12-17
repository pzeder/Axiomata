<template>
  <div class="level-container" @click="emit('openLevel')" :style="{ backgroundColor: levelColor(levelIndex, level) }">
    <AxiomContainer class="goal-axiom" :width=10 :height=10 :axiom="level.goalAxiom" :symbols="course.symbols"
      :variables="course.variables" :background="levelColor(levelIndex, level)"
      :borderColor="levelColor(levelIndex, level)" />
    <div class="level-title"> Level {{ levelNumber }} </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import { CourseData, LevelData, LevelPointer } from '@/scripts/Interfaces';

interface Props {
  course: CourseData;
  chapterIndex: number;
  levelIndex: number;
  level: LevelData;
  frontLevelPointer: LevelPointer | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel']);

const levelNumber: ComputedRef<number> = computed(() => {
  return props.course.chapters.slice(0, props.chapterIndex).map(c => c.levels.length).reduce((acc, val) =>  acc + val, 1) + props.levelIndex;
});

function isFrontLevel(levelIndex: number): boolean {
  return props.frontLevelPointer?.chapterIndex === props.chapterIndex && props.frontLevelPointer?.levelIndex === levelIndex;
}

function levelColor(levelIndex: number, level: LevelData): string {
  return (isFrontLevel(levelIndex) ? 'orange' : (level.bestSolution ? 'lightgreen' : 'rgb(150,150,150)'));
}
</script>

<style>
.level-container {
  display: flex;
  place-items: center;
  border: 0.5vw solid black;
  border-radius: 1.5vw;
  margin-top: 0.5vw;
  margin-bottom: 0.5vw;
  user-select: none;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.level-container:hover {
  opacity: 100%;
  transform: scale(1.04);
}

.goal-axiom {
  flex: 1;
  margin-left: 2vw;
}

.level-title {
  user-select: none;
  font-size: 3vw;
  flex: 3;
  display: grid;
  place-items: center;
  text-align: center;
  padding-left: 3vw;
  padding-right: 10vw;
  color: rgb(44, 44, 44);
}
</style>