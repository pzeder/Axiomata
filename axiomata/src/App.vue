<template>
  <button class="home" v-if="showHomeButton" @click="openStartMenu"> Home </button>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu" />
  <SaveStateSelection v-if="showSaveSelection" :userName="userName" @saveStateSelected="saveStateSelected"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" :userName="userName" @newSaveStateCreated="newSaveStateCreated"
    @openStartMenu="openStartMenu" />
  <LevelSelection v-if="showLevelSelection" @openStartMenu="openStartMenu" @levelSelected="levelSelected"
    @openSaveStateMenu="openSaveStateMenu" :saveID="saveID" />
  <PlayWindow v-if="showPlayWindow" @openLevelMenu="openLevelMenu" :saveID="saveID" :chapterName="chapterName"
    :levelName="levelName" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import StartMenu from '@/components/menus/StartMenu.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import LevelSelection from '@/components/menus/LevelSelection.vue';
import PlayWindow from '@/components/play/PlayWindow.vue';

const showHomeButton: Ref<boolean> = ref(false);
const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

const userName: Ref<string> = ref('Philippe');
const saveID: Ref<any> = ref(null);
const chapterName: Ref<string> = ref('');
const levelName: Ref<string> = ref('');


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

function levelSelected(newChapterName: string, newLevelName: string): void {
  chapterName.value = newChapterName;
  levelName.value = newLevelName;
  hideAll();
  showPlayWindow.value = true;
}

function openLevelMenu(): void {
  chapterName.value = "";
  levelName.value = "";
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

.home {
  font-size: 20pt;
  margin-top: 5vh;
}
</style>