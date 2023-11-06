<template>
  <CourseSelection v-if="showCourseSelection" 
    @courseSelected="courseSelected" />
  <LevelSelection v-if="showLevelSelection" 
    @levelSelected="levelSelected" @backToCourseMenu="backToCourseMenu" 
    :selectedCourse="selectedCourse" :userName="userName"/>
  <PlayWindow v-if="showPlayWindow" 
    @backToLevelMenu="backToLevelMenu" 
    :userName="userName"
    :selectedCourse="selectedCourse" 
    :selectedChapter="selectedChapter" 
    :selectedLevel="selectedLevel" />
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
const selectedChapter: Ref<string> = ref("");
const selectedLevel: Ref<string> = ref("");

const userName: Ref<string> = ref("Philippe");

function courseSelected(courseName: string): void {
  selectedCourse.value = courseName;
  showCourseSelection.value = false;
  showLevelSelection.value = true;
}

function levelSelected(chapterName: string, levelName: string): void {
  selectedChapter.value = chapterName;
  selectedLevel.value = levelName;
  showLevelSelection.value = false;
  showPlayWindow.value = true;
}

function backToLevelMenu(): void {
  selectedLevel.value = "";
  showPlayWindow.value = false;
  showLevelSelection.value = true;
}

function backToCourseMenu(): void {
  showCourseSelection.value = true;
  showLevelSelection.value = false;  
}
</script>
