<template>
  <button v-if="showHomeButton" @click="openStartMenu"> Home </button>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu" />
  <SaveStateSelection v-if="showSaveSelection" :sessionState="sessionState" @saveStateSelected="saveStateSelected"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" @newSaveStateCreated="newSaveStateCreated"
    @openStartMenu="openStartMenu" :sessionState="sessionState" />
  <LevelSelection v-if="showLevelSelection" @openStartMenu="openStartMenu" @levelSelected="levelSelected"
    @openSaveStateMenu="openSaveStateMenu" :sessionState="sessionState" />
  <PlayWindow v-if="showPlayWindow" @openLevelMenu="openLevelMenu" :sessionState="sessionState" />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import StartMenu from '@/components/menus/StartMenu.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import LevelSelection from '@/components/menus/LevelSelection.vue';
import PlayWindow from '@/components/play/PlayWindow.vue';
import { SessionState } from '@/scripts/Interfaces';

const showHomeButton: Ref<boolean> = ref(false);
const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

const sessionState: Ref<SessionState> = ref({ userName: "Philippe", saveID: null, chapterName: "", levelName: "" });

function newSaveStateCreated(newSaveID: any) {
  sessionState.value.saveID = newSaveID;
  openLevelMenu();
}

function saveStateSelected(newSaveID: number): void {
  sessionState.value.saveID = newSaveID;
  hideAll();
  showHomeButton.value = true;
  showLevelSelection.value = true;
}

function levelSelected(chapterName: string, levelName: string): void {
  sessionState.value.chapterName = chapterName;
  sessionState.value.levelName = levelName;
  hideAll();
  showPlayWindow.value = true;
}

function openLevelMenu(): void {
  sessionState.value.chapterName = "";
  sessionState.value.levelName = "";
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
</style>