<template>
  <button class="home" v-if="showHomeButton" @click="openStartMenu"> Home </button>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu"
    @openEditSelection="openEditSelection" />
  <SaveStateSelection v-if="showSaveSelection" :userName="userName" @saveStateSelected="saveStateSelected"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" :userName="userName" @newSaveStateCreated="newSaveStateCreated"
    @openStartMenu="openStartMenu" />
  <LevelSelection v-if="showLevelSelection" @openStartMenu="openStartMenu" @selectLevel="selectLevel"
    @openSaveStateMenu="openSaveStateMenu" :saveID="saveID" />
  <PlayWindow v-if="showPlayWindow" @openLevelMenu="openLevelMenu" @updateSequenceHistory="updateSequenceHistory"
    @levelFinished="updateLevelEnd" @nextLevel="nextLevel" :levelData="currentLevelData"
    :hasNextLevel="nextChapterIndex !== -1" />
  <EditSelection v-if="showEditSelection" :userName="userName" @openEditor="openEditor" />
  <EditorScreen v-if="showEditorScreen" :editID="editID" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import StartMenu from '@/components/menus/StartMenu.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import LevelSelection from '@/components/menus/LevelSelection.vue';
import PlayWindow from '@/components/play/PlayWindow.vue';
import EditSelection from '@/components/menus/EditSelection.vue'
import EditorScreen from '@/components/editor/EditorScreen.vue';
import { AxiomData, LevelData } from '@/scripts/Interfaces';
import axios from 'axios';

// menu variables
const showHomeButton: Ref<boolean> = ref(false);
const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);
const showEditSelection: Ref<boolean> = ref(false);
const showEditorScreen: Ref<boolean> = ref(false);

// user variables
const userName: Ref<string> = ref('Philippe');

// couse variables
const saveID: Ref<any> = ref(null);
const currentChapterIndex: Ref<number> = ref(-1);
const currentLevelIndex: Ref<number> = ref(-1);
const nullAxiom: AxiomData = { upperSequence: [], lowerSequence: [] };
const nullLevel: LevelData = { symbolAlphabet: [], axioms: [], derivates: [], levelName: '', goalAxiom: nullAxiom, sequenceHistory: [[]], levelFinished: false, variables: [] };
const currentLevelData: Ref<LevelData> = ref(nullLevel);
const nextChapterIndex: Ref<number> = ref(-1);
const nextLevelIndex: Ref<number> = ref(-1);

// editor variables
const editID: Ref<any> = ref(null);

function newSaveStateCreated(newSaveID: any) {
  saveID.value = newSaveID;
  openLevelMenu();
}

function saveStateSelected(newSaveID: number): void {
  saveID.value = newSaveID;
  hideAll();
  showHomeButton.value = true;
  showLevelSelection.value = true;
}

async function selectLevel(chapterIndex: number, levelIndex: number): Promise<void> {
  if (currentChapterIndex.value === chapterIndex && currentLevelIndex.value === levelIndex) {
    return;
  }
  try {
    currentChapterIndex.value = chapterIndex;
    currentLevelIndex.value = levelIndex;
    hideAll();
    await fetchLevel();
    showPlayWindow.value = true;
  } catch (error) {
    console.log('Error while selecting level:', error)
  }
}

function openLevelMenu(): void {
  hideAll();
  showHomeButton.value = true;
  showLevelSelection.value = true;
}

function openStartMenu(): void {
  hideAll();
  showStartMenu.value = true;
}

function openSaveStateMenu(): void {
  hideAll();
  showHomeButton.value = true;
  showSaveSelection.value = true;
}

function openNewCourseMenu(): void {
  hideAll();
  showHomeButton.value = true;
  showNewCourseSelection.value = true;
}

function openEditSelection(): void {
  hideAll();
  showHomeButton.value = true;
  showEditSelection.value = true;
}

function openEditor(newEditID: any): void {
  editID.value = newEditID;
  hideAll();
  showHomeButton.value = true;
  showEditorScreen.value = true;
}

function hideAll(): void {
  showHomeButton.value = false;
  showStartMenu.value = false;
  showSaveSelection.value = false;
  showNewCourseSelection.value = false;
  showLevelSelection.value = false;
  showPlayWindow.value = false;
  showEditSelection.value = false;
  showEditorScreen.value = false;
}

async function fetchLevel(): Promise<void> {
  try {
    const query: string = '?saveID=' + saveID.value
      + '&chapterIndex=' + currentChapterIndex.value
      + '&levelIndex=' + currentLevelIndex.value;
    const response = await axios.get('http://localhost:3000/level' + query);
    if (response.status === 200) {
      currentLevelData.value.symbolAlphabet = response.data.symbolAlphabet;
      currentLevelData.value.axioms = response.data.axioms;
      currentLevelData.value.derivates = response.data.derivates;
      currentLevelData.value.levelName = response.data.levelName;
      currentLevelData.value.goalAxiom = response.data.goalAxiom;
      currentLevelData.value.sequenceHistory = response.data.sequenceHistory;
      currentLevelData.value.levelFinished = response.data.levelFinished;
      currentLevelData.value.variables = response.data.variables;
      nextChapterIndex.value = response.data.nextChapterIndex;
      nextLevelIndex.value = response.data.nextLevelIndex;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateSequenceHistory(newSequence: number[]): Promise<void> {
  currentLevelData.value.sequenceHistory.push(newSequence);
  try {
    const updatedData = {
      saveID: saveID.value,
      chapterIndex: currentChapterIndex.value,
      levelIndex: currentLevelIndex.value,
      newHistory: currentLevelData.value.sequenceHistory
    };
    const response = await axios.patch(`http://localhost:3000/sequenceHistory`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

async function updateLevelEnd(): Promise<void> {
  currentLevelData.value.levelFinished = true;
  try {
    const updatedData = {
      saveID: saveID.value,
      chapterIndex: currentChapterIndex.value,
      levelIndex: currentLevelIndex.value,
    };
    const response = await axios.patch(`http://localhost:3000/levelEnd`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
    } else if (response.status === 400) {
      console.error(response.data.message);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function nextLevel(): void {
  currentChapterIndex.value = nextChapterIndex.value;
  currentLevelIndex.value = nextLevelIndex.value;
  fetchLevel();
}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Fredoka One', cursive;
}

button {
  font-family: 'Fredoka One', cursive;
  border-radius: 20pt;
}

.home {
  font-size: 20pt;
  margin-top: 5vh;
}
</style>