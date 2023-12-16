<template>
  <div class="course-container">
    <div class="course-title"> {{ course.title }} </div>
    <div class="chapter-list" v-for="(chapter, chapterIndex) in course.chapters" :key="chapterIndex">
      <ChapterContainer :course="course" :chapterIndex="chapterIndex" :chapter="chapter"
        :frontLevelPointer="frontLevelPointer" @openLevel="(levelIndex) => emit('openLevel', chapterIndex, levelIndex)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ChapterContainer from '../UI/ChapterContainer.vue';
import { CourseData, LevelPointer } from '@/scripts/Interfaces';

interface Props {
  course: CourseData;
  frontLevelPointer: LevelPointer | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel']);
</script>

<style>
.course-container {
  display: flex;
  flex-direction: column;
  margin-top: 10vw;
}

.course-title {
  display: grid;
  place-items: center;
  font-size: 9vw;
  color: rgb(44, 44, 44);
}
</style>