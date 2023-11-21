<template>
  <button class="home" v-if="showHomeButton" @click="openStartMenu"> Home </button>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu" />
  <SaveStateSelection v-if="showSaveSelection" :userName="userName" @saveStateSelected="saveStateSelected"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" :userName="userName" @newSaveStateCreated="newSaveStateCreated"
    @openStartMenu="openStartMenu" />
  <LevelSelection v-if="showLevelSelection" @openStartMenu="openStartMenu" @selectLevel="selectLevel"
    @openSaveStateMenu="openSaveStateMenu" :saveID="saveID" />
  <PlayWindow v-if="showPlayWindow" @openLevelMenu="openLevelMenu" @updateSequenceHistory="updateSequenceHistory" @levelFinished="updateLevelEnd" @nextLevel="nextLevel" :levelData="currentLevelData" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import StartMenu from '@/components/menus/StartMenu.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import LevelSelection from '@/components/menus/LevelSelection.vue';
import PlayWindow from '@/components/play/PlayWindow.vue';
import { AxiomData, LevelData, SymbolData } from './scripts/Interfaces';
import axios from 'axios';

// menu variables
const showHomeButton: Ref<boolean> = ref(false);
const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

// user variables
const userName: Ref<string> = ref('Philippe');

// couse variables
const saveID: Ref<any> = ref(null);
const currentChapterIndex: Ref<number> = ref(-1);
const currentLevelIndex: Ref<number> = ref(-1);
const nullAxiom: AxiomData = {upperSequence: [], lowerSequence: []};
const nullLevel: LevelData = {symbolAlphabet: [], axioms: [], derivates: [], levelName: '', goalAxiom: nullAxiom, sequenceHistory: [[]], levelFinished: false, nextChapterIndex: -1, nextLevelIndex: -1};
const currentLevelData: Ref<LevelData> = ref(nullLevel);
const nextChapterIndex: Ref<number> = ref(-1);
const nextLevelIndex: Ref<number> = ref(-1);
const nextLevelData: Ref<LevelData> = ref(nullLevel);

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
  try {
    currentChapterIndex.value = chapterIndex;
    currentLevelIndex.value = levelIndex;
    hideAll();
    await fetchLevel(currentLevelData, currentChapterIndex.value, currentLevelIndex.value);
    console.log('this before', currentLevelData.value);
    showPlayWindow.value = true;
    console.log('this before', currentLevelData.value);
    if (currentLevelData.value.nextChapterIndex !== -1) {
      await fetchLevel(nextLevelData, currentLevelData.value.nextChapterIndex, currentLevelData.value.nextLevelIndex);
    }
    console.log('this after', currentLevelData.value);
    console.log('next', nextLevelData.value);
  } catch(error) {
    console.log('Error while selecting Level:', error);
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

function hideAll(): void {
  showHomeButton.value = false;
  showStartMenu.value = false;
  showSaveSelection.value = false;
  showNewCourseSelection.value = false;
  showLevelSelection.value = false;
  showPlayWindow.value = false;
}

async function fetchLevel(levelData: Ref<LevelData>, chapterIndex: number, levelIndex: number): Promise<void> {
  console.log(chapterIndex, levelIndex);
  try {
    const query: string = '?saveID=' + saveID.value
      + '&chapterIndex=' + chapterIndex
      + '&levelIndex=' + levelIndex;
    const response = await axios.get('http://localhost:3000/level' + query);
    if (response.status === 200) {
      levelData.value.symbolAlphabet = response.data.symbolAlphabet;
      levelData.value.axioms = response.data.axioms;
      levelData.value.derivates = response.data.derivates;
      levelData.value.levelName = response.data.levelName;
      levelData.value.goalAxiom = response.data.goalAxiom;
      levelData.value.sequenceHistory = response.data.sequenceHistory;
      levelData.value.levelFinished = response.data.levelFinished;
      levelData.value.nextChapterIndex = response.data.nextChapterIndex;
      levelData.value.nextLevelIndex = response.data.nextLevelIndex;
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
  currentChapterIndex.value = currentLevelData.value.nextChapterIndex;
  currentLevelIndex.value = currentLevelData.value.nextLevelIndex;
  // transfer nextLevelData to currentLevelData
  currentLevelData.value.symbolAlphabet = nextLevelData.value.symbolAlphabet;
  currentLevelData.value.axioms = nextLevelData.value.axioms;
  currentLevelData.value.derivates = nextLevelData.value.derivates;
  currentLevelData.value.levelName = nextLevelData.value.levelName;
  currentLevelData.value.goalAxiom = nextLevelData.value.goalAxiom;
  currentLevelData.value.sequenceHistory = nextLevelData.value.sequenceHistory;
  currentLevelData.value.levelFinished = nextLevelData.value.levelFinished;
  currentLevelData.value.nextChapterIndex = nextLevelData.value.nextChapterIndex;
  currentLevelData.value.nextLevelIndex = nextLevelData.value.nextLevelIndex;
  fetchLevel(nextLevelData, currentLevelData.value.nextChapterIndex, currentLevelData.value.nextLevelIndex);
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