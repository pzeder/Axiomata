<template>
  <div v-if="course">
    <div class="sidebar-left" v-if="showLevelSelection">
      <TextButton class="sidebar-button" text="Home" background='white' @click="emit('openHomeScreen')" />
    </div>
    <CourseContainer v-if="showLevelSelection" :course="course" :frontLevelPointer="frontLevelPointer"
      @openLevel="openLevel" @openHomeScreen="emit('openHomeScreen')" />
    <PlayScreen v-if="showPlayScreen" :symbols="course?.symbols" :variables="course?.variables" :axioms="selectedAxioms"
      :derivates="selectedDerivates" :level="selectedLevel" @addMove="addMove" @openLevelSelection="openLevelSelection"
      @finishLevel="finishLevel" @undoMove="undoMove" />
    <VictoryWindow v-if="showVictoryWindow" :hasNextLevel="hasNextLevel" @openLevelSelection="openLevelSelection"
      @nextLevel="nextLevel" />
  </div>
</template>

<script setup lang="ts">
import { AxiomData, ChapterData, CourseData, LevelData, LevelPointer, MoveData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef } from 'vue';
import VictoryWindow from './VictoryWindow.vue';
import PlayScreen from './PlayScreen.vue';
import CourseContainer from '../UI/CourseContainer.vue';
import TextButton from '../UI/TextButton.vue';

interface Props {
  saveID: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['openHomeScreen', 'openSaveStateMenu']);

const showLevelSelection: Ref<boolean> = ref(false);
const showPlayScreen: Ref<boolean> = ref(false);
const showVictoryWindow: Ref<boolean> = ref(false);

const course: Ref<CourseData | null> = ref(null);

const frontLevelPointer: ComputedRef<LevelPointer | null> = computed(() => {
  if (!course.value) {
    return null;
  }
  for (let ch = 0; ch < course.value.chapters.length; ch++) {
    let chapter: ChapterData = course.value.chapters[ch];
    for (let lvl = 0; lvl < chapter.levels.length; lvl++) {
      let level: LevelData = chapter.levels[lvl];
      if (!level.bestSolution) {
        return {
          chapterIndex: ch,
          levelIndex: lvl
        };
      }
    }
  }
  return null;
});

const selectedLevelPointer: Ref<LevelPointer | null> = ref(null);

const hasNextLevel: ComputedRef<boolean> = computed(() => {
  if (!selectedLevelPointer.value || !course.value) {
    return false;
  }
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  return chapterIndex < course.value.chapters.length - 1 || levelIndex < course.value.chapters[chapterIndex].levels.length - 1;
});

const selectedLevel: ComputedRef<LevelData | null> = computed(() => {
  if (!selectedLevelPointer.value || !course.value) {
    return null;
  }
  let chapterIndex = selectedLevelPointer.value.chapterIndex;
  let levelIndex = selectedLevelPointer.value.levelIndex;
  return course.value.chapters[chapterIndex].levels[levelIndex];
});

const selectedAxioms: ComputedRef<AxiomData[]> = computed(() => {
  if (!course.value || !selectedLevelPointer.value) {
    return [];
  }
  let axioms: AxiomData[] = []
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  for (let i = 0; i <= chapterIndex; i++) {
    axioms.push(...course.value.chapters[i].newAxioms);
  }
  return axioms;
}
);

const selectedDerivates: ComputedRef<AxiomData[]> = computed(() => {
  if (!course.value || !selectedLevelPointer.value) {
    return [];
  }
  let derivates: AxiomData[] = [];
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  const addGoalAxiom = (ch: number, lvl: number) => {
    if (course.value?.chapters[ch].levels[lvl].bonus) {
      derivates.push(course.value.chapters[ch].levels[lvl].goalAxiom as AxiomData);
    }
  }
  for (let ch = 0; ch < chapterIndex; ch++) {
    for (let lvl = 0; lvl < course.value.chapters[ch].levels.length; lvl++) {
      addGoalAxiom(ch, lvl);
    }
  }
  for (let lvl = 0; lvl < levelIndex; lvl++) {
    addGoalAxiom(chapterIndex, lvl);
  }
  return derivates;
});

onMounted(() => {
  fetchCourse();
  openLevelSelection();
});

async function fetchCourse(): Promise<void> {
  try {
    const query: string = '?saveID=' + props.saveID;
    const response = await axios.get('http://localhost:3000/course' + query);
    if (response.status === 200) {
      course.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function openLevel(chapterIndex: number, levelIndex: number) {
  selectedLevelPointer.value = { chapterIndex: chapterIndex, levelIndex: levelIndex };
  openPlayScreen();
}

function openPlayScreen(): void {
  hideAll();
  showPlayScreen.value = true;
}

function openLevelSelection(): void {
  hideAll();
  showLevelSelection.value = true;
}

function openVictoryWindow(): void {
  hideAll();
  showVictoryWindow.value = true;
}

function hideAll(): void {
  showLevelSelection.value = false;
  showPlayScreen.value = false;
  showVictoryWindow.value = false;
}

async function saveGame(): Promise<void> {
  try {
    const updatedData = {
      saveID: props.saveID,
      course: course.value
    };
    const response = await axios.patch(`http://localhost:3000/saveGame`, updatedData);
    if (response.status === 200) {
      console.log('Game saved successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function addMove(move: MoveData): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  course.value.chapters[chapterIndex].levels[levelIndex].moveHistory.push(move);
  saveGame();
}

function undoMove(): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  course.value.chapters[chapterIndex].levels[levelIndex].moveHistory.pop();
  saveGame();
}

function finishLevel(): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  openVictoryWindow();
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  const level: LevelData = course.value.chapters[chapterIndex].levels[levelIndex];
  if (!level.bestSolution || level.moveHistory.length < level.bestSolution.length) {
    course.value.chapters[chapterIndex].levels[levelIndex].bestSolution = level.moveHistory;
  }
  course.value.chapters[chapterIndex].levels[levelIndex].moveHistory = [];
  saveGame();
}

function nextLevel(): void {
  incrementSelectedLevelPointer();
  if (selectedLevelPointer.value) {
    openPlayScreen();
  }
}

function incrementSelectedLevelPointer(): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  const maxLevel: number = course.value.chapters[selectedLevelPointer.value.chapterIndex].levels.length;
  selectedLevelPointer.value.levelIndex += 1;
  if (selectedLevelPointer.value.levelIndex >= maxLevel) {
    selectedLevelPointer.value.chapterIndex += 1;
    selectedLevelPointer.value.levelIndex = 0;
  }
  if (selectedLevelPointer.value.chapterIndex >= course.value.chapters.length) {
    selectedLevelPointer.value = null;
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

.sidebar-button {
  width: 4vw;
  height: 3vw;
  margin-bottom: 1vw;
}
</style>