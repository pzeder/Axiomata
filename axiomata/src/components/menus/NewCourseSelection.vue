<template>
  <div class="course-container">
    <button v-for="c in courses" :key="c.courseName" @click="createNewSaveState(c.courseName)"> {{ c.courseName
    }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { SessionState } from '@/scripts/Interfaces';

interface Props {
  sessionState: SessionState;
}
const props = defineProps<Props>();
const sessionState: Ref<SessionState> = ref(props.sessionState);

interface CourseHeader {
  courseName: string;
}
const courses: Ref<CourseHeader[]> = ref([]);

onMounted(() => {
  fetchCourseHeaders();
});

const emit = defineEmits(['newSaveStateCreated', 'openStartMenu']);

function openStartMenu(): void {
  emit('openStartMenu');
}

async function createNewSaveState(courseName: string) {
  try {
    const data = ({
      userName: sessionState.value.userName,
      courseName: courseName
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

<style>
.course-container {
  display: flex;
  flex-direction: column;
}

.course-container button {
  margin-bottom: 10px;
}
</style>