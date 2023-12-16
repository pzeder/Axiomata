<template>
  <div class="sidebar-left">
    <HomeButton @click="emit('openHomeScreen')" />
  </div>
  <div class="course-list">
    <transition-group name="course-list" tag="div">
      <div class="flex-box" v-for="header in courseHeaders" :key="header.courseID">
        <div class="new-course-container" @click="clickedCourse(header.courseID)">
          <AxiomContainer class="header-axiom" :width=10 :height=10 :axiom="header.coverAxiom" :symbols="header.symbols"
            :variables="header.variables" background="white" borderColor="rgb(70, 179, 215)" />
          <div class="new-course-title"> {{ header.title }} </div>
        </div>
        <TextButton text="Löschen" @click.stop="deleteCourse(header.courseID)" />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import HomeButton from './HomeButton.vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import TextButton from '../UI/TextButton.vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';

interface Props {
  userName: string;
}
const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);

interface CourseHeader {
  courseID: any;
  title: string;
  coverAxiom: AxiomData;
  symbols: SymbolData[];
  variables: SymbolData[];
}
const courseHeaders: Ref<CourseHeader[]> = ref([]);

onMounted(() => {
  fetchCourseHeaders();
});

const emit = defineEmits(['openCourse', 'openHomeScreen']);

async function fetchCourseHeaders(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/courseHeaders');
    if (response.status === 200) {
      courseHeaders.value = response.data.courseHeaders;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function clickedCourse(courseID: any): Promise<void> {
  try {
    const data = ({
      userName: userName.value,
      courseID: courseID
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

async function deleteCourse(courseID: any): Promise<void> {
  try {
    const data = { courseID: courseID }
    const response = await axios.patch('http://localhost:3000/deleteCourse', data);
    if (response.status === 200) {
      courseHeaders.value = response.data.courseHeaders;
      console.log('course deleted successfully');
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error patching data:', error);
  }
}
</script>

<style>
.sidebar-left {
  position: fixed;
  left: 2vw;
  top: 2vw;
  display: grid;
  place-items: left;
}

.course-list {
  display: grid;
  place-items: center;
  width: 100vw;
  margin-left: -2vw;
  margin-top: 5vw;
}

.flex-box {
  display: flex;
  align-items: center;
}

.new-course-container {
  width: 60vw;
  border: 0.7vw solid rgb(44, 44, 44);
  border-radius: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: lightblue;
  margin-bottom: 1vw;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.new-course-container:hover {
  opacity: 100%;
  transform: scale(1.04);
}

.new-course-title {
  user-select: none;
  font-size: 3vw;
  flex: 3;
  padding-left: 4vw;
  color: rgb(44, 44, 44);
  ;
}

.header-axiom {
  flex: 1;
}

.course-list-enter-active,
.course-list-leave-active {
  transition: all 0.5s ease;
}

.course-list-enter,
.course-list-leave-to {
  opacity: 0;
  transform: translateX(-10vw);
}

.course-list-move {
  transition: transform 0.5s ease;
  transition-delay: 0.3s;
}

.course-list-leave-active {
  position: absolute;
}
</style>