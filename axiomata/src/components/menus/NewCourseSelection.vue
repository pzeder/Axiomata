<template>
  <HomeButton @click="emit('openStartMenu')" />
  <div class="course-container">
    <button v-for="(course, index) in courseHeaders" :key="index" @click="createNewSaveState(course.title)"> {{ course.title
    }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import HomeButton from './HomeButton.vue';

interface Props {
  userName: string;
}
const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);

interface CourseHeader {
  title: string;
}
const courseHeaders: Ref<CourseHeader[]> = ref([]);

onMounted(() => {
  fetchCourseHeaders();
});

const emit = defineEmits(['openCourse', 'openStartMenu']);

async function fetchCourseHeaders(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/courseHeaders');
    if (response.status === 200) {
      courseHeaders.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function createNewSaveState(courseTitle: string) {
  try {
    const data = ({
      userName: userName.value,
      courseTitle: courseTitle
    });
    const response = await axios.post('http://localhost:3000/newSaveState', data);
    if (response.status === 200) {
      console.log('New saveState created successfully', response.data);
      emit('openCourse', response.data.saveID);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.course-container {
  display: flex;
  flex-direction: column;
  margin-top: 10vh;
}

.course-container button {
  margin-bottom: 10px;
  font-size: 40pt;
}
</style>