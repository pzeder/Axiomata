<template>
  <div class="sidebar-left">
    <HomeButton @click="emit('openHomeScreen')" />
  </div>
  <CourseContainer :course="course" :frontLevelPointer="frontLevelPointer"
    @openLevel="(chapterIndex, levelIndex) => emit('openLevel', chapterIndex, levelIndex)" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { CourseData, LevelPointer } from '@/scripts/Interfaces';
import HomeButton from '../menus/HomeButton.vue';
import CourseContainer from '../UI/CourseContainer.vue';

interface Props {
  course: CourseData;
  frontLevelPointer: LevelPointer | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel', 'openHomeScreen']);
</script>

<style>
.sidebar-left {
  position: fixed;
  left: 2vw;
  top: 2vw;
  display: grid;
  place-items: left;
}

.chapter-list {
  width: 100vw;
  display: grid;
}
</style>