<template>
  <CourseSelection v-if="showCourseSelection" @courseSelected="courseSelected" />
  <LevelSelection v-if="showLevelSelection" :selectedCourse="selectedCourse" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import CourseSelection from '@/components/CourseSelection.vue';
import LevelSelection from '@/components/LevelSelection.vue';

const showCourseSelection: Ref<boolean> = ref(true);
const showLevelSelection: Ref<boolean> = ref(false);
const selectedCourse: Ref<string> = ref("");

function courseSelected(course: string) {
  selectedCourse.value = course;
  showCourseSelection.value = false;
  showLevelSelection.value = true;
}
</script>
