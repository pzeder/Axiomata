<template>
  <div class="chapter-container">
    <div class="chapter-title"> {{ chapter.title }} </div>
    <AxiomList v-if="chapter.newAxioms.length > 0" :title="''" :axioms="chapter.newAxioms" :symbols="course.symbols"
      :variables="course.variables" :maxWidth=40 :containerWidth=10 />
    <div class="level-list" v-for="(level, levelIndex) in chapter.levels">
      <LevelContainer :course="course" :chapterIndex="chapterIndex" :levelIndex="levelIndex" :level="level"
        :frontLevelPointer="frontLevelPointer" @openLevel="emit('openLevel', levelIndex)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import LevelContainer from './LevelContainer.vue';
import { ChapterData, CourseData, LevelPointer } from '@/scripts/Interfaces';

interface Props {
  course: CourseData;
  chapterIndex: number;
  chapter: ChapterData;
  frontLevelPointer: LevelPointer | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel']);
</script>