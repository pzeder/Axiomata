<template>
  <ChapterScreen v-if="showChapterScreen" :chapters="course?.chapters" :frontLevelPointer="frontLevelPointer"
    @openSaveStateMenu="emit('openSaveStateMenu')" @openLevel="openLevel" @openStartMenu="emit('openStartMenu')" />
  <LevelScreen v-if="showLevelScreen" :symbols="course?.symbols" :variables="course?.variables" :axioms="selectedAxioms"
    :derivates="selectedDerivates" :level="selectedLevel" @addMove="addMove" @openChapterScreen="openChapterScreen"
    @finishLevel="finishLevel" />
  <VictoryWindow v-if="showVictoryWindow" :hasNextLevel="frontLevelPointer !== null" @openLevelMenu="openChapterScreen"
    @nextLevel="nextLevel" />
</template>

<script setup lang="ts">
import { AxiomData, ChapterData, CourseData, LevelData, LevelPointer, MoveData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef } from 'vue';
import ChapterScreen from './ChapterScreen.vue';
import LevelScreen from './LevelScreen.vue';
import VictoryWindow from './VictoryWindow.vue';

interface Props {
  saveID: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['openStartMenu', 'openSaveStateMenu']);

const showChapterScreen: Ref<boolean> = ref(false);
const showLevelScreen: Ref<boolean> = ref(false);
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
      if (!level.solved) {
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
  for (let ch = 0; ch < chapterIndex; ch++) {
    for (let lvl = 0; lvl < course.value.chapters[ch].levels.length; lvl++) {
      derivates.push(course.value.chapters[ch].levels[lvl].goalAxiom);
    }
  }
  for (let lvl = 0; lvl < levelIndex; lvl++) {
    derivates.push(course.value.chapters[chapterIndex].levels[lvl].goalAxiom);
  }
  return derivates;
});

onMounted(() => {
  fetchCourse();
  showChapterScreen.value = true;
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
  openLevelScreen();
}

function openLevelScreen(): void {
  hideAll();
  showLevelScreen.value = true;
}

function openChapterScreen(): void {
  hideAll();
  showChapterScreen.value = true;
}

function openVictoryWindow(): void {
  hideAll();
  showVictoryWindow.value = true;
}

function hideAll(): void {
  showChapterScreen.value = false;
  showLevelScreen.value = false;
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

function finishLevel(): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  openVictoryWindow();
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  course.value.chapters[chapterIndex].levels[levelIndex].solved = true;
  saveGame();
}

function nextLevel(): void {
  updateSelectedLevelPointer();
  if (selectedLevelPointer.value) {
    openLevelScreen();
  }
}

function updateSelectedLevelPointer(): void {
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