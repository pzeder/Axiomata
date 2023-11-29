<template>
  <div class="course-container">
    <button v-for="c in courses" :key="c.title" @click="createNewSaveState(c.title)"> {{ c.title
    }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

interface Props {
  userName: string;
}
const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);

interface CourseHeader {
  title: string;
}
const courses: Ref<CourseHeader[]> = ref([]);

onMounted(() => {
  fetchCourseHeaders();
});

const emit = defineEmits(['newSaveStateCreated']);

async function createNewSaveState(courseTitle: string) {
  try {
    const data = ({
      userName: userName.value,
      courseTitle: courseTitle
    });
    const response = await axios.post('http://localhost:3000/newSaveState', data);
    if (response.status === 200) {
      emit('newSaveStateCreated', response.data.saveID, response.data.symbolAlphabet);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchCourseHeaders(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/courses');
    if (response.status === 200) {
      const courseHeaders = response.data;
      courses.value = response.data;
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