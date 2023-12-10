<template>
  <div class="home-button" @click="emit('openHomeScreen')"> Home </div>
  <TitleBar tag="Kurs" :title="course?.title" :height=10 @editTitle="showTextInput = true" />
  <EditChapterList v-if="course" :editID="editID" :course="course" @addNewChapter="addNewChapter"
    @setChapterTitle="setChapterTitle" @deleteChapter="deleteChapter" @addSymbol="addSymbol"
    @deleteSymbol="deleteSymbol" />
  <div class="submit-button" :style="{ background: courseValid ? 'lightgreen' : 'gray' }" @click="submitCourse"> Kurs
    hochladen </div>
  <TextInput v-if="showTextInput" title="Titel des Kurses ändern" :placeholder="course?.title"
    @updateText="setCourseTitle" @close="showTextInput = false" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted, ComputedRef, computed, defineEmits } from 'vue';
import { CourseData, ChapterData, SymbolData, LevelData, AxiomData, SymbolPointer } from '@/scripts/Interfaces';
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

async function saveEdit(): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      course: course.value
    };
    const response = await axios.patch('http://localhost:3000/saveEdit', updateData);
    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function setCourseTitle(text: string): void {
  showTextInput.value = false;
  if (text.length === 0 || !course.value) {
    return;
  }
  course.value.title = text;
  saveEdit();
}

function addNewChapter(index: number): void {
  if (!course.value) {
    return
  }
  const newChapter: ChapterData = {
    title: 'Neues Kapitel',
    newAxioms: [],
    levels: []
  }
  course.value.chapters.splice(index, 0, newChapter);
  saveEdit();
}

function setChapterTitle(chapterIndex: number, title: string): void {
  if (!course.value) {
    return
  }
  course.value.chapters[chapterIndex].title = title;
  saveEdit();
}

function deleteChapter(chapterIndex: number) {
  if (!course.value) {
    return
  }
  course.value.chapters.splice(chapterIndex, 1);
  saveEdit();
}

function addSymbol(symbol: SymbolData): void {
  if (!course.value) {
    return
  }
  course.value.symbols.push(symbol);
  saveEdit();
}

function deleteSymbol(symbolPointer: SymbolPointer): void {
  if (!course.value) {
    return
  }

  course.value.symbols.splice(symbolPointer.index, 1);

  const cleanSymbol = (sp: SymbolPointer): SymbolPointer => {
    if (sp.type === symbolPointer.type) {
      return ({
        type: sp.type,
        index: (sp.index < symbolPointer.index) ? sp.index : sp.index - 1
      });
    }
    return sp;
  };

  const cleanAxiom = (axiom: AxiomData): AxiomData => {
    const poisonedSymbol = (sp: SymbolPointer): boolean => sp.type === symbolPointer.type && sp.index === symbolPointer.index;
    if (axiom.upperSequence.some(poisonedSymbol) || axiom.lowerSequence.some(poisonedSymbol)) {
      return { upperSequence: [], lowerSequence: [] };
    }
    return {
      upperSequence: axiom.upperSequence.map(cleanSymbol),
      lowerSequence: axiom.lowerSequence.map(cleanSymbol)
    }
  };

  const cleanLevel = (lvl: LevelData): LevelData => ({
    title: lvl.title,
    goalAxiom: cleanAxiom(lvl.goalAxiom),
    sequenceHistory: lvl.sequenceHistory,
    solved: lvl.solved
  });

  const nonEmpty = (axiom: AxiomData): boolean => (axiom.upperSequence.length > 0 && axiom.lowerSequence.length > 0);

  const cleanChapter = (ch: ChapterData): ChapterData => ({
    title: ch.title,
    newAxioms: ch.newAxioms.map(cleanAxiom).filter(nonEmpty),
    levels: ch.levels.map(cleanLevel)
  });

  course.value.chapters.map(cleanChapter)
}

function addNewAxiom(chapterIndex: number, axiom: AxiomData) {
  if (!course.value) {
    return
  }
  // TODO
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