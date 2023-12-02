<template>
  <TitleBar :title="course?.title" :height=10 @editTitle="editCourseTitle" />
  <EditChapterList v-if="course" :editID="editID" :chapters="course.chapters" @updateChapters="updateChapters"
    @editChapterTitle="editChapterTitle" @editLevelTitle="editLevelTitle" />
  <AxiomEditor v-if="showAxiomEditor" :symbols="course?.symbols" @openSymbolEditor="openSymbolEditor"/>
  <SymbolEditor v-if="showSymbolEditor" :editID="editID" :text="symbolText" @editSymbolText="editSymbolText"
    @closeSymbolEditor="showSymbolEditor = false" @updateSymbols="updateSymbols" />
  <TextInput v-if="showTextInput" :placeholder="textInputPlaceholder" :target="textInputTarget" @updateText="updateText"
    @click="showTextInput = false" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted, ComputedRef, computed } from 'vue';
import { CourseData, ChapterData, SymbolData } from '@/scripts/Interfaces';
import EditChapterList from '@/components/editor/EditChapterList.vue';
import TextInput from '@/components/editor/TextInput.vue';
import TitleBar from './TitleBar.vue';
import AxiomEditor from './AxiomEditor.vue'
import SymbolEditor from './SymbolEditor.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();

const course: Ref<CourseData | null> = ref(null);
const chapterIndex: Ref<number> = ref(-1);
const levelIndex: Ref<number> = ref(-1);
const showAxiomEditor: Ref<boolean> = ref(true);
const showSymbolEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const textInputTarget: Ref<string> = ref('');
const symbolText: Ref<string> = ref('text');
const textInputPlaceholder: ComputedRef<string | undefined> = computed(() => {
  switch (textInputTarget.value) {
    case 'course':
      return course.value?.title;
    case 'chapter':
      return course.value?.chapters[chapterIndex.value].title;
    case 'level':
      return course.value?.chapters[chapterIndex.value].levels[levelIndex.value].title;
    case 'symbol':
      return symbolText.value;
    default:
      return '';
  }
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

async function updateText(text: string): Promise<void> {
  showTextInput.value = false;
  if (textInputTarget.value === 'symbol') {
    symbolText.value = text;
    return
  }
  if (text.length === 0) {
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      text: text,
      target: textInputTarget.value,
      chapterIndex: chapterIndex.value,
      levelIndex: levelIndex.value
    };
    const response = await axios.patch('http://localhost:3000/text', updateData);
    if (response.status === 200) {
      const updatedCourse: CourseData = response.data.course;
      course.value = updatedCourse;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function editCourseTitle(): void {
  textInputTarget.value = 'course';
  showTextInput.value = true;
}

function editChapterTitle(index: number): void {
  textInputTarget.value = 'chapter';
  chapterIndex.value = index;
  showTextInput.value = true;
}

function editLevelTitle(chIndex: number, lvlIndex: number): void {
  textInputTarget.value = 'level';
  chapterIndex.value = chIndex;
  levelIndex.value = lvlIndex;
  showTextInput.value = true;
}

function editSymbolText(): void {
  textInputTarget.value = 'symbol';
  showTextInput.value = true;
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

function openSymbolEditor(): void {
  symbolText.value = 'text';
  showSymbolEditor.value = true;
}
</script>