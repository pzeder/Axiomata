<template>
  <div v-for="(chapter, index) in course.chapters" :key="index">
    <AddButton target="chapter" @click="addNewChapter(index)" />
    <EditChapter :editID="editID" :chapterIndex="index" :chapter="chapter" :symbols="course.symbols"
      @editChapterTitle="editChapterTitle(index)" @deleteChapter="deleteChapter(index)"
      @updateChapters="(updatedChapters) => emit('updateChapters', updatedChapters)"
      @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" @editNewAxiom="editNewAxiom(index)" />
  </div>
  <AddButton target="chapter" @click="addNewChapter(course.chapters.length)" />
  <AxiomEditor v-if="showAxiomEditor" :editID="editID" :symbols="course?.symbols"
    @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" @closeAxiomEditor="showAxiomEditor = false"
    @saveAxiom="addNewAxiom" />
  <TextInput v-if="showTextInput" title="Titel des Kapitels ändern" :placeholder="editChapter?.title"
    @updateText="updateChapterTitle" @click="showTextInput = false" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import { AxiomData, ChapterData, CourseData } from '@/scripts/Interfaces';
import axios from 'axios';
import EditChapter from './EditChapter.vue';
import AddButton from '@/components/editor/AddButton.vue';
import AxiomEditor from '../axiomEditor/AxiomEditor.vue';
import TextInput from '../TextInput.vue';
import CourseScreen from '@/components/play/CourseScreen.vue';

interface Props {
  editID: any;
  course: CourseData;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateChapters', 'updateSymbols']);

const showAxiomEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const editChapterIndex: Ref<number> = ref(-1);
const editChapter: ComputedRef<ChapterData | null> = computed(() => {
  if (editChapterIndex.value === -1) {
    return null;
  }
  return props.course.chapters[editChapterIndex.value];
});

async function addNewChapter(position: number): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      position: position
    }
    const response = await axios.post('http://localhost:3000/addNewChapter', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('New chapter added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function deleteChapter(index: number) {
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: index
    }
    const response = await axios.patch('http://localhost:3000/deleteChapter', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('chapter deleted successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

async function updateChapterTitle(text: string): Promise<void> {
  showTextInput.value = false;
  if (text.length === 0) {
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      text: text,
      chapterIndex: editChapterIndex.value
    };
    const response = await axios.patch('http://localhost:3000/chapterTitle', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function addNewAxiom(axiom: AxiomData): Promise<void> {
  showAxiomEditor.value = false;
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: editChapterIndex.value,
      axiom: axiom
    }
    const response = await axios.post('http://localhost:3000/addNewAxiom', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      console.log('New axiom added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

function editChapterTitle(index: number): void {
  editChapterIndex.value = index;
  showTextInput.value = true;
}

function editNewAxiom(index: number): void {
  editChapterIndex.value = index;
  showAxiomEditor.value = true;
}
</script>

<style></style>