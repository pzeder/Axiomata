<template>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu" />
  <SaveStateSelection v-if="showSaveSelection" :userState="userState" @saveStateSelected="saveStateSelected"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" @newSaveStateCreated="newSaveStateCreated"
    @openStartMenu="openStartMenu" :userState="userState" />
  <LevelSelection v-if="showLevelSelection" @openStartMenu="openStartMenu" @levelSelected="levelSelected"
    @openSaveStateMenu="openSaveStateMenu" :userState="userState" />
  <PlayWindow v-if="showPlayWindow" @openLevelMenu="openLevelMenu" :userState="userState" />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import StartMenu from '@/components/StartMenu.vue';
import SaveStateSelection from '@/components/SaveStateSelection.vue';
import NewCourseSelection from '@/components/NewCourseSelection.vue';
import LevelSelection from '@/components/LevelSelection.vue';
import PlayWindow from '@/components/PlayWindow.vue';
import { UserState } from '@/scripts/Interfaces';

const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

const defaultUserState = { userName: "Philippe", saveID: null, chapterName: "", levelName: "" };
const userState: Ref<UserState> = ref(defaultUserState);

function newSaveStateCreated(newSaveID: any) {
  userState.value.saveID = newSaveID;
  openLevelMenu();
}

function saveStateSelected(newSaveID: number): void {
  userState.value.saveID = newSaveID;
  hideAll();
  showLevelSelection.value = true;
}

function levelSelected(chapterName: string, levelName: string): void {
  userState.value.chapterName = chapterName;
  userState.value.levelName = levelName;
  hideAll();
  showPlayWindow.value = true;
}

function openLevelMenu(): void {
  userState.value.chapterName = "";
  userState.value.levelName = "";
  hideAll();
  showLevelSelection.value = true;
}

function openStartMenu(): void {
  hideAll();
  showStartMenu.value = true;
}

function openSaveStateMenu(): void {
  hideAll();
  showSaveSelection.value = true;
}

function openNewCourseMenu(): void {
  hideAll();
  showNewCourseSelection.value = true;
}

function hideAll(): void {
  showStartMenu.value = false;
  showSaveSelection.value = false;
  showNewCourseSelection.value = false;
  showLevelSelection.value = false;
  showPlayWindow.value = false;
}
</script>
