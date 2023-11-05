<template>
  <CourseSelection v-if="showCourseSelection" @courseSelected="courseSelected" />
  <LevelSelection v-if="showLevelSelection" @levelSelected="levelSelected" :selectedCourse="selectedCourse" />
  <PlayWindow v-if="showPlayWindow" :selectedLevel="selectedLevel" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import CourseSelection from '@/components/CourseSelection.vue';
import LevelSelection from '@/components/LevelSelection.vue';
import PlayWindow from '@/components/PlayWindow.vue';

const showCourseSelection: Ref<boolean> = ref(true);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

const selectedCourse: Ref<string> = ref("");
const selectedLevel: Ref<string> = ref("");

function courseSelected(courseName: string): void {
  selectedCourse.value = courseName;
  showCourseSelection.value = false;
  showLevelSelection.value = true;
}

function levelSelected(levelName: string): void {
  selectedLevel.value = levelName;
  showLevelSelection.value = false;
  showPlayWindow.value = true;
}
</script>
