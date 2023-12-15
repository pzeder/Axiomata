<template>
  <div class="level-container" @click="emit('openLevel')" :style="{ backgroundColor: levelColor(levelIndex, level) }">
    <AxiomContainer class="goal-axiom" :width=10 :height=10 :axiom="level.goalAxiom" :symbols="course.symbols"
      :variables="course.variables" :background="levelColor(levelIndex, level)"
      :borderColor="levelColor(levelIndex, level)" />
    <div class="level-title"> {{ level.title }} </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
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

function isFrontLevel(levelIndex: number): boolean {
  return props.frontLevelPointer?.chapterIndex === props.chapterIndex && props.frontLevelPointer?.levelIndex === levelIndex;
}

function levelColor(levelIndex: number, level: LevelData): string {
  return (isFrontLevel(levelIndex) ? 'orange' : (level.bestSolution ? 'lightgreen' : 'rgb(150,150,150)'));
}
</script>