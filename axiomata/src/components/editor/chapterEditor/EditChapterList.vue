<template>
  <div v-for="(chapter, index) in course.chapters" :key="index">
    <AddButton target="chapter" @click="addNewChapter(index)" />
    <EditChapter :chapter="chapter" :index="index" @editChapterTitle="editChapterTitle(index)"
      @deleteChapter="deleteChapter(index)" />
  </div>
  <AddButton target="chapter" @click="addNewChapter(course.chapters.length)" />
  <AxiomEditor v-if="showAxiomEditor" :editID="editID" :level="editLevel" :symbols="course?.symbols"
    @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" />
  <TextInput v-if="showTextInput" title="Titel des Kapitels ändern" :placeholder="editChapter?.title"
    @updateText="updateChapterTitle" @click="showTextInput = false" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import { ChapterData, CourseData, LevelData, LevelPointer } from '@/scripts/Interfaces';
import axios from 'axios';
import EditChapter from './EditChapter.vue';
import AddButton from '@/components/editor/AddButton.vue';
import AxiomEditor from '../axiomEditor/AxiomEditor.vue';
import TextInput from '../TextInput.vue';

interface Props {
  editID: any;
  course: CourseData;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateChapters', 'updateSymbols']);

const showAxiomEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const editLevelPointer: Ref<LevelPointer> = ref({
  chapterIndex: -1,
  levelIndex: -1
});
const editChapter: ComputedRef<ChapterData | null> = computed(() => {
  const chapterIndex: number = editLevelPointer.value.chapterIndex;
  if (chapterIndex === -1) {
    return null;
  }
  return props.course.chapters[chapterIndex];
});
const editLevel: ComputedRef<LevelData | null> = computed(() => {
  const levelIndex: number = editLevelPointer.value.levelIndex;
  if (!editChapter.value || levelIndex === -1) {
    return null;
  }
  return editChapter.value.levels[levelIndex];
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
      chapterIndex: editLevelPointer.value.chapterIndex
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

function editChapterTitle(index: number): void {
  editLevelPointer.value.chapterIndex = index;
  showTextInput.value = true;
}

function editGoalAxiom(chapterIndex: number, levelIndex: number): void {
  editLevelPointer.value.chapterIndex = chapterIndex;
  editLevelPointer.value.levelIndex = levelIndex;
  showAxiomEditor.value = true;
}
</script>

<style></style>