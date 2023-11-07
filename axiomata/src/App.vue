<template>
  <SaveStateSelection v-if="showSaveSelection" :userState="userState" @saveStateSelected="saveStateSelected" />
  <NewCourseSelection v-if="showCourseSelection" />
  <LevelSelection v-if="showLevelSelection" @levelSelected="levelSelected" @backToCourseMenu="backToCourseMenu"
    :userState="userState" />
  <PlayWindow v-if="showPlayWindow" @backToLevelMenu="backToLevelMenu" :userState="userState" />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import SaveStateSelection from '@/components/SaveStateSelection.vue';
import NewCourseSelection from '@/components/NewCourseSelection.vue';
import LevelSelection from '@/components/LevelSelection.vue';
import PlayWindow from '@/components/PlayWindow.vue';
import { UserState } from '@/scripts/Interfaces';
import axios from 'axios';

const showSaveSelection: Ref<boolean> = ref(true);
const showCourseSelection: Ref<boolean> = ref(false);
const showLevelSelection: Ref<boolean> = ref(false);
const showPlayWindow: Ref<boolean> = ref(false);

const defaultUserState = { userID: null, userName: "", saveID: null, chapterName: "", levelName: "" };
const userState: Ref<UserState> = ref(defaultUserState);

const userName: Ref<string> = ref("Philippe");

onMounted(() => {
  fetchUserData();
});

async function fetchUserData(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/userState?userName=' + userName.value);
    if (response.status === 200) {
      userState.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function saveStateSelected(id: number): void {
  userState.value.saveID = id;
  showCourseSelection.value = false;
  showLevelSelection.value = true;
}

function levelSelected(chapterName: string, levelName: string): void {
  userState.value.chapterName = chapterName;
  userState.value.levelName = levelName;
  showLevelSelection.value = false;
  showPlayWindow.value = true;
}

function backToLevelMenu(): void {
  userState.value.chapterName = "";
  userState.value.levelName = "";
  showPlayWindow.value = false;
  showLevelSelection.value = true;
}

function backToCourseMenu(): void {
  showCourseSelection.value = true;
  showLevelSelection.value = false;
}
</script>
