<template>
    <div class="play-container">
        <div> Du spielst gerade <b> {{ selectedLevel }} </b> </div>
        <button @click="finishLevel"> klicke hier um zu gewinnen </button>
        <div v-if="levelFinsihed" style="font-size: 100pt"> Wahnsinn! Du hast es geschafft! </div>
        <button @click="backToLevelMenu"> zurück zur Levelauswahl </button>
    </div>
</template>

<script setup lang=ts>
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits } from 'vue';

interface Props {
  userName: string;
  selectedCourse: string;
  selectedChapter: string;
  selectedLevel: string;
}

const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);
const selectedCourse: Ref<string> = ref(props.selectedCourse);
const selectedChapter: Ref<string> = ref(props.selectedChapter);
const selectedLevel: Ref<string> = ref(props.selectedLevel);

const levelFinsihed: Ref<boolean> = ref(false);

const emit = defineEmits(['backToLevelMenu']);

function finishLevel(event: MouseEvent): void {
    levelFinsihed.value = true;
    updateCourse();
}

async function updateCourse(): Promise<void> {
  try {
    const updatedData = {
        userName: userName.value,
        courseName:  selectedCourse.value,
        chapterName: selectedChapter.value,
        levelName: selectedLevel.value,
        newStatus: 'done'
    };
    const response = await axios.patch(`http://localhost:3000/course`, updatedData);
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

function backToLevelMenu(event: MouseEvent): void {
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