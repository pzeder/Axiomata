<template>
  <div class="play-container">
    <div> Du spielst gerade <b> {{ userState.levelName }} </b> </div>
    <button @click="finishLevel"> klicke hier um zu gewinnen </button>
    <div v-if="levelFinsihed" style="font-size: 100pt"> Wahnsinn! Du hast es geschafft! </div>
    <button @click="backToLevelMenu"> zurück zur Levelauswahl </button>
  </div>
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

const emit = defineEmits(['backToLevelMenu']);

function finishLevel(): void {
  levelFinsihed.value = true;
  updateCourse();
}

async function updateCourse(): Promise<void> {
  try {
    const updatedData = {
      userName: userState.value.userName,
      saveID: userState.value.saveID,
      chapterName: userState.value.chapterName,
      levelName: userState.value.levelName,
      newStatus: 'done'
    };
    const response = await axios.patch(`http://localhost:3000/saveState`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
      // Update your Vue state or perform additional actions here
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function backToLevelMenu(): void {
  emit('backToLevelMenu');
}
</script>

<style>
.play-container {
  display: flex;
  flex-direction: column;
}

.play-container button {
  margin-bottom: 10px;
}
</style>