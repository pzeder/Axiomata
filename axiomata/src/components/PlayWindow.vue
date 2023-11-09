<template>
  <div> {{ userState.levelName }} </div>
  <div class="workbench">
    <button class="magic" v-if="!levelFinsihed" @click="finishLevel"> Magischer Knopf </button>
    <div class="finish" v-if="levelFinsihed"> Level geschafft! <br>
      <button @click="openLevelMenu"> zurück zur Levelauswahl </button>
    </div>
  </div>
  <div class="derivate-bar"> ABLEITUNGEN </div>
  <div class="axiom-bar"> AXIOME
    <div class="axiom-container" v-for="axiom in levelData.axioms" :key="axiom"> {{ axiom }}</div>
  </div>
  <div class="goal"> ZIEL </div>
</template>

<script setup lang=ts>
import { UserState } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted } from 'vue';

interface Props {
  userState: UserState;
}
const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

interface LevelData {
  axioms: string[];
}

const levelData: Ref<LevelData> = ref({ axioms: [] });

const levelFinsihed: Ref<boolean> = ref(false);

onMounted(() => {
  fetchLevel();
});

const emit = defineEmits(['openLevelMenu']);

function openLevelMenu(): void {
  emit('openLevelMenu');
}

function finishLevel(): void {
  levelFinsihed.value = true;
  updateCourse();
}

async function fetchLevel(): Promise<void> {
  try {
    const query: string = '?saveID=' + userState.value.saveID
      + '&chapterName=' + userState.value.chapterName
      + '&levelName=' + userState.value.levelName;
    const response = await axios.get('http://localhost:3000/level' + query);
    if (response.status === 200) {
      levelData.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function updateCourse(): Promise<void> {
  try {
    const updatedData = {
      saveID: userState.value.saveID,
      chapterName: userState.value.chapterName,
      levelName: userState.value.levelName,
      newStatus: 'done'
    };
    const response = await axios.patch(`http://localhost:3000/levelEnd`, updatedData);
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
.workbench {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 20vw;
  top: 0;
  height: 70vh;
  width: 80vw;
}

.magic {
  padding: 10px 20px;
  font-size: 16px;
  background-color: gold;
  cursor: pointer;
}

.finish {
  position: absolute;
  font-size: 80pt;
  color: rgb(255, 157, 0);
}

.axiom-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 20vw;
  height: 100vh;
  background-color: #333;
  color: #fff;
}

.derivate-bar {
  position: fixed;
  bottom: 0;
  left: 20vw;
  width: 100%;
  height: 30vh;
  background-color: #5a5a5a;
  color: #fff;
}

.goal {
  position: fixed;
  right: 0;
  top: 0;
  width: 10vw;
  height: 10vw;
  background-color: #333;
  color: #fff;
}

.axiom-container {
  left: 20%;
  width: 80%;
  height: 20%;
  text-align: center;
  outline: 2px solid white;
}
</style>