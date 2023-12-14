<template>
  <HomeScreen v-if="showHomeScreen" @openNewCourseMenu="openNewCourseMenu" @openSaveStateMenu="openSaveStateMenu"
    @openEditSelection="openEditSelection" />
  <SaveStateSelection v-if="showSaveSelection" :userName="userName" @openCourse="openCourse"
    @openNewCourseMenu="openNewCourseMenu" @openHomeScreen="openHomeScreen" />
  <NewCourseSelection v-if="showNewCourseSelection" :userName="userName" @openCourse="openCourse"
    @openHomeScreen="openHomeScreen" />
  <CourseScreen v-if="showCourseScreen" :saveID="saveID" @openHomeScreen="openHomeScreen" />
  <EditSelection v-if="showEditSelection" :userName="userName" @openEditor="openEditor" @openHomeScreen="openHomeScreen"/>
  <EditorScreen v-if="showEditorScreen" :editID="editID" @openHomeScreen="openHomeScreen" />
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import HomeScreen from '@/components/menus/HomeScreen.vue';
import SaveStateSelection from '@/components/menus/SaveStateSelection.vue';
import NewCourseSelection from '@/components/menus/NewCourseSelection.vue';
import CourseScreen from '@/components/play/CourseScreen.vue';
import EditSelection from '@/components/menus/EditSelection.vue'
import EditorScreen from '@/components/editor/EditorScreen.vue';

// menu variables
const showHomeScreen: Ref<boolean> = ref(true);
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
  showCourseScreen.value = true;
}

function openHomeScreen(): void {
  hideAll();
  showHomeScreen.value = true;
}

function openSaveStateMenu(): void {
  hideAll();
  showSaveSelection.value = true;
}

function openNewCourseMenu(): void {
  hideAll();
  showNewCourseSelection.value = true;
}

function openEditSelection(): void {
  hideAll();
  showEditSelection.value = true;
}

function openEditor(newEditID: any): void {
  editID.value = newEditID;
  hideAll();
  showEditorScreen.value = true;
}
function hideAll(): void {
  showHomeScreen.value = false;
  showSaveSelection.value = false;
  showNewCourseSelection.value = false;
  showEditSelection.value = false;
  showEditorScreen.value = false;
  showCourseScreen.value = false;
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