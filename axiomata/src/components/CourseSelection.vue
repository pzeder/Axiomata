<template>
  <button v-for="course in courses" :key="course.id" @click="handleButtonClick(course)"> {{ course }} </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import axios from 'axios';

interface CourseInstance {
  id: number;
  courseName: string;
}

interface LevelInstance {
  id: number;
  levelName: string;
}

const courses: Ref<CourseInstance[]> = ref([]);
const levels: Ref<LevelInstance[]> = ref([]);

onMounted(() => {
  fetchCourses();
});

function handleButtonClick(course: CourseInstance) {
  // fetchLevels();
  console.log(course);
}

async function fetchCourses(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/courses');
    if (response.status === 200) {
      courses.value = [];
      courses.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>