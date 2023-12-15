<template>
  <div class="sidebar-left">
    <HomeButton @click="emit('openHomeScreen')" />
  </div>
  <div class="course-title"> {{ course.title }} </div>
  <div class="chapter-list" v-for="(chapter, chapterIndex) in course.chapters" :key="chapterIndex">
    <ChapterContainer :course="course" :chapterIndex="chapterIndex" :chapter="chapter"
      :frontLevelPointer="frontLevelPointer" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { CourseData, LevelPointer } from '@/scripts/Interfaces';
import HomeButton from '../menus/HomeButton.vue';
import ChapterContainer from '../menus/ChapterContainer.vue';

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

.chapter-list-container {
  left: 0;
  top: 0;
  width: 100vw;
  display: grid;
  margin-top: 5vw;
}

.course-title {
  display: grid;
  place-items: center;
  font-size: 9vw;
  color: rgb(44, 44, 44);
}

.chapter-container {
  display: grid;
  place-items: center;
  margin-bottom: 2vw;
}

.chapter-title {
  user-select: none;
  font-size: 5vw;
  flex: 3;
  color: lightblue;
  text-align: center;
  margin-bottom: 1vw;
}

.level-container {
  display: flex;
  place-items: center;
  border: 0.5vw solid black;
  border-radius: 1.5vw;
  margin-bottom: 1vw;
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