<template>
  <button class="home" v-if="showHomeButton" @click="openStartMenu"> Home </button>
  <StartMenu v-if="showStartMenu" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu"
    @openEditSelection="openEditSelection" />
  <SaveStateSelection v-if="showSaveSelection" :userName="userName" @openCourse="openCourse"
    @openNewCourseMenu="openNewCourseMenu" @openStartMenu="openStartMenu" />
  <NewCourseSelection v-if="showNewCourseSelection" :userName="userName" @openCourse="openCourse"
    @openStartMenu="openStartMenu" />
  <CourseScreen v-if="showCourseScreen" :saveID="saveID" />
  <EditSelection v-if="showEditSelection" :userName="userName" @openEditor="openEditor" />
  <EditorScreen v-if="showEditorScreen" :editID="editID" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import StartMenu from '@/components/menus/StartMenu.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import CourseScreen from '@/components/play/CourseScreen.vue';
import EditSelection from '@/components/menus/EditSelection.vue'
import EditorScreen from '@/components/editor/EditorScreen.vue';

// menu variables
const showHomeButton: Ref<boolean> = ref(false);
const showStartMenu: Ref<boolean> = ref(true);
const showSaveSelection: Ref<boolean> = ref(false);
const showNewCourseSelection: Ref<boolean> = ref(false);
const showEditSelection: Ref<boolean> = ref(false);
const showEditorScreen: Ref<boolean> = ref(false);
const showCourseScreen: Ref<boolean> = ref(false);

// user variables
const userName: Ref<string> = ref('Philippe');

// course variables
const saveID: Ref<any> = ref(null);

// editor variables
const editID: Ref<any> = ref(null);

function openCourse(newSaveID: number): void {
  saveID.value = newSaveID;
  hideAll();
  showHomeButton.value = true;
  showCourseScreen.value = true;
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
  showEditSelection.value = false;
  showEditorScreen.value = false;
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