<template>
  <div class="course-container">
    <button v-for="course in courses" :key="course.id" @click="handleButtonClick(course)"> {{ course }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';

interface CourseInstance {
  id: number;
  courseName: string;
}

const courses: Ref<CourseInstance[]> = ref([]);

onMounted(() => {
  fetchCourses();
});

function handleButtonClick(course: CourseInstance) {
  emit('courseSelected', course);
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

const emit = defineEmits(['courseSelected']);
</script>

<style>
.course-container {
  display: flex;
  flex-direction: column;
}

.course-container button {
  margin-bottom: 10px;
  /* This adds space between the buttons */
}
</style>