<template>
  <div class="headbar">
    <button :style="{ position: 'relative' }" @click="openLevelMenu"> Zurück </button>
    <div :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 + '%' }">
      <div :style="{ color: 'white' }"> {{ userState.levelName }} </div>
    </div>
  </div>
  <div class="workbench">
    <button class="magic" v-if="!levelFinsihed" @click="finishLevel"> Magischer Knopf </button>
    <div class="finish" v-if="levelFinsihed"> Level geschafft! <br>
      <button @click="openLevelMenu"> zurück zur Levelauswahl </button>
    </div>
  </div>
  <div class="derivate-bar">
    <div class="derivate-container" v-for="axiom in levelData.derivates" :key="axiom.name">
      <Axiom :axiomData="axiom" @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <div class="axiom-bar">
    <div class="axiom-container" v-for="axiom in levelData.axioms" :key="axiom.name">
      <Axiom :axiomData="axiom" @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <div class="goal-container">
    <div>
      ZIEL
    </div>
  </div>
  <div v-if="selectedAxiom.name !== ''" :style="{
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: (selectedAxiomX - 50) + 'px',
    top: (selectedAxiomY - 50) + 'px',
    width: 70 + 'px',
    height: 70 + 'px',
    background: 'black',
  }" @mouseup="() => { draggingAxiom = false }" @mousedown="() => { draggingAxiom = true }">
    <Axiom :axiomData="selectedAxiom" :key="selectedAxiom.name" />
  </div>
</template>

<script setup lang=ts>
import Axiom from '@/components/Axiom.vue';
import { UserState, AxiomData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted } from 'vue';

interface Props {
  userState: UserState;
}
const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

interface LevelData {
  axioms: AxiomData[];
  derivates: AxiomData[];
}

const levelData: Ref<LevelData> = ref({ axioms: [], derivates: [] });
const levelFinsihed: Ref<boolean> = ref(false);
const selectedAxiom: Ref<AxiomData> = ref({ name: "" });
const selectedAxiomX: Ref<number> = ref(0);
const selectedAxiomY: Ref<number> = ref(0);
const draggingAxiom: Ref<boolean> = ref(false);


onMounted(() => {
  window.addEventListener('mousemove', updateSelectedAxiomPos);
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

function selectAxiom(axiom: AxiomData): void {
  selectedAxiom.value = axiom;
  draggingAxiom.value = true;
}

function updateSelectedAxiomPos(event: MouseEvent) {
  console.log(draggingAxiom.value, selectedAxiom.value.name, selectedAxiom.value.name !== '');
  if (draggingAxiom.value) {
    selectedAxiomX.value = event.clientX;
    selectedAxiomY.value = event.clientY;
  }
}
</script>

<style>
.headbar {
  display: flex;
  width: 100vw;
  height: 5vh;
  background: rgb(89, 204, 245);
}

.workbench {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 20vw;
  top: 5vh;
  height: 62.5vh;
  width: 80vw;
}

.magic {
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  background-color: gold;
  border-radius: 20pt;
  cursor: pointer;
}

.finish {
  position: absolute;
  font-size: 80pt;
  color: rgb(255, 157, 0);
}

.axiom-bar {
  position: relative;
  left: 0;
  top: 0;
  width: 20vw;
  height: 100vh;
  background: rgb(252, 223, 203);
  color: #fff;
}

.derivate-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 20vw;
  width: 100%;
  height: 30vh;
  background: rgb(208, 237, 248);
  color: #fff;
}

.goal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: 5vh;
  width: 10vw;
  height: 10vw;
  background-color: #333;
  color: #fff;
}

.axiom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 25%;
}

.derivate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
}
</style>