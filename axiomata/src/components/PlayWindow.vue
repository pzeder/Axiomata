<template>
  <div> {{ userState.levelName }} </div>
  <div class="centered-container">
    <button class="magic" v-if="!levelFinsihed" @click="finishLevel"> Magischer Knopf </button>
    <div class="finish" v-if="levelFinsihed"> Level geschafft! <br>
      <button @click="openLevelMenu"> zurück zur Levelauswahl </button>
    </div>
  </div>
  <div class="toolbar"> TOOLBAR </div>
</template>

<script setup lang=ts>
import { UserState } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits } from 'vue';

interface Props {
  userState: UserState;
}
const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

const levelFinsihed: Ref<boolean> = ref(false);

const emit = defineEmits(['openLevelMenu']);

function openLevelMenu(): void {
  emit('openLevelMenu');
}

function finishLevel(): void {
  levelFinsihed.value = true;
  updateCourse();
}

async function updateCourse(): Promise<void> {
  try {
    const updatedData = {
      saveID: userState.value.saveID,
      chapterName: userState.value.chapterName,
      levelName: userState.value.levelName,
      newStatus: 'done'
    };
    const response = await axios.patch(`http://localhost:3000/saveState`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}
</script>

<style>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.magic {
  padding: 10px 20px;
  font-size: 16px;
  background-color: gold;
  cursor: pointer;
}

.finish {
  position: absolute;
  font-size: 100pt;
  color: rgb(255, 157, 0);
}

.toolbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30vh;
  background-color: #333;
  color: #fff;
}
</style>