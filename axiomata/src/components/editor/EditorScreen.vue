<template>
  <div class="home-button" @click="emit('openHomeScreen')"> Home </div>
  <TitleBar tag="Kurs" :title="course?.title" :height=10 @editTitle="showTextInput = true" />
  <EditChapterList v-if="course" :editID="editID" :course="course" @updateChapters="updateChapters"
    @updateSymbols="updateSymbols" />
  <div class="submit-button" :style="{ background: courseValid ? 'lightgreen' : 'gray' }" @click="submitCourse"> Kurs
    hochladen </div>
  <TextInput v-if="showTextInput" title="Titel des Kurses ändern" :placeholder="course?.title"
    @updateText="updateCourseTitle" @click="showTextInput = false" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted, ComputedRef, computed, defineEmits } from 'vue';
import { CourseData, ChapterData, SymbolData, LevelData } from '@/scripts/Interfaces';
import EditChapterList from './chapterEditor/EditChapterList.vue';
import TextInput from './TextInput.vue';
import TitleBar from './TitleBar.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['openHomeScreen']);

const course: Ref<CourseData | null> = ref(null);
const showTextInput: Ref<boolean> = ref(false);

const invalidLevel = (level: LevelData): boolean =>
  level.goalAxiom.upperSequence.length === 0 || level.goalAxiom.lowerSequence.length === 0;

const invalidChapter = (chapter: ChapterData): boolean =>
  chapter.levels.length === 0 || chapter.levels.some(invalidLevel);

const courseValid: ComputedRef<boolean> = computed(() => {
  if (!course.value || course.value.chapters.length === 0) {
    return false;
  }
  return course.value.chapters.filter(invalidChapter).length === 0;
});

onMounted(() => {
  fetchEdit();
});

async function fetchEdit(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/edit' + query);
    if (response.status === 200) {
      course.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateCourseTitle(text: string): Promise<void> {
  showTextInput.value = false;
  if (text.length === 0 || !course.value) {
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      text: text
    };
    const response = await axios.patch('http://localhost:3000/courseTitle', updateData);
    if (response.status === 200) {
      const updatedCourseTitle: string = response.data.courseTitle;
      course.value.title = updatedCourseTitle;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function updateChapters(updatedChapters: ChapterData[]): void {
  if (course.value) {
    course.value.chapters = updatedChapters;
  }
}

function updateSymbols(updatedSymbols: SymbolData[]): void {
  if (course.value) {
    course.value.symbols = updatedSymbols;
  }
}

async function submitCourse(): Promise<void> {
  if (!courseValid.value) {
    return;
  }
  try {
    const data = {
      editID: props.editID,
    };
    const response = await axios.post('http://localhost:3000/submitCourse', data);
    if (response.status === 200) {
      console.log('Course submitted successfully');
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.home-button {
  width: 10vw;
  font-size: 1vw;
  color: black;
  padding: 0.5vw;
  background-color: white;
  border: 0.2vw solid black;
  border-radius: 1vw;
  display: grid;
  place-items: center;
  user-select: none;
}

.submit-button {
  display: grid;
  place-items: center;
  padding: 1vw;
  font-size: 3vw;
  color: black;
  background: lightgreen;
  border: 1vw solid black;
  border-radius: 2vw;
  user-select: none;
}
</style>