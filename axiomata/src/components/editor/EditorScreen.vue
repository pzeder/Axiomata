<template>
  <TitleBar tag="Kurs" :title="course?.title" :height=10 @editTitle="showTextInput = true" />
  <EditChapterList v-if="course" :editID="editID" :course="course" @updateChapters="updateChapters"
    @updateSymbols="updateSymbols" />
  <div class="submit-button" :style="{ background: courseValid ? 'lightgreen' : 'gray' }"> Kurs hochladen </div>
  <TextInput v-if="showTextInput" title="Titel des Kurses ändern" :placeholder="course?.title"
    @updateText="updateCourseTitle" @click="showTextInput = false" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted, ComputedRef, computed } from 'vue';
import { CourseData, ChapterData, SymbolData, LevelData } from '@/scripts/Interfaces';
import EditChapterList from './chapterEditor/EditChapterList.vue';
import TextInput from './TextInput.vue';
import TitleBar from './TitleBar.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();

const course: Ref<CourseData | null> = ref(null);
const showTextInput: Ref<boolean> = ref(false);

const invalidLevel = (level: LevelData): boolean =>
  level.goalAxiom.upperSequence.length === 0 || level.goalAxiom.lowerSequence.length === 0;

const invalidChapter = (chapter: ChapterData): boolean =>
  chapter.levels.length === 0 || chapter.levels.some(invalidLevel);

const courseValid: ComputedRef<boolean> = computed(() => {
  if (!course.value) {
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
</script>

<style>
.submit-button {
  display: grid;
  place-items: center;
  padding: 1vw;
  font-size: 3vw;
  color: black;
  background: lightgreen;
  border: 1vw solid black;
  border-radius: 2vw;
}
</style>