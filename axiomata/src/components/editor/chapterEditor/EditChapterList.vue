<template>
  <div v-for="(chapter, index) in course.chapters" :key="index">
    <AddButton target="chapter" @click="emit('addNewChapter', index)" />
    <EditChapter :chapterIndex="index" :chapter="chapter" :symbols="course.symbols"
      @editChapterTitle="editChapterTitle(index)" @deleteChapter="emit('deleteChapter', index)"
      @editNewAxiom="editNewAxiom" />
  </div>
  <AddButton target="chapter" @click="emit('addNewChapter', course.chapters.length)" />
  <AxiomEditor v-if="showAxiomEditor" :symbols="course?.symbols" upTitle="OBEN" lowTitle="UNTEN"
    @addSymbol="emit('addSymbol')"
    @saveAxiom="addNewAxiom"
    @close="showAxiomEditor = false" />
  <TextInput v-if="showTextInput" title="Titel des Kapitels ändern" :placeholder="editChapter?.title"
    @updateText="setChapterTitle" @close="showTextInput = false" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import { ChapterData, CourseData } from '@/scripts/Interfaces';;
import EditChapter from './EditChapter.vue';
import AddButton from '@/components/editor/AddButton.vue';
import AxiomEditor from '../axiomEditor/AxiomEditor.vue';
import TextInput from '../TextInput.vue';

interface Props {
  course: CourseData;
}

const props = defineProps<Props>();
const emit = defineEmits(['addNewChapter', 'setChapterTitle', 'deleteChapter', 'addSymbol']);

const showAxiomEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const editChapterIndex: Ref<number> = ref(-1);
const editChapter: ComputedRef<ChapterData | null> = computed(() => {
  if (editChapterIndex.value === -1) {
    return null;
  }
  return props.course.chapters[editChapterIndex.value];
});

async function setChapterTitle(title: string): Promise<void> {
  emit('setChapterTitle', editChapterIndex.value, title);
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