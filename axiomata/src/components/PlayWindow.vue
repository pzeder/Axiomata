<template>
  <div> {{ userState.levelName }} </div>
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
  <div v-if="showSelectedAxiom" :style="{
    display: 'flex',
    position: 'absolute',
    left: (mouseX - 50) + 'px',
    top: (mouseY - 50) + 'px',
    width: 100 + 'px',
    height: 100 + 'px',
    background: 'black'
  }" @mousemove="updateMousePos" @mouseup="() => { showSelectedAxiom = false }">
    <Axiom :axiomData="selectedAxiom" />
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
const mouseX: Ref<number> = ref(0);
const mouseY: Ref<number> = ref(0);
const showSelectedAxiom: Ref<boolean> = ref(false);

onMounted(() => {
  window.addEventListener('mousemove', updateMousePos);
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
  showSelectedAxiom.value = true;
}

function updateMousePos(event: MouseEvent) {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
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
  display: flex;
  position: fixed;
  bottom: 0;
  left: 20vw;
  width: 100%;
  height: 30vh;
  background-color: #5a5a5a;
  color: #fff;
}

.goal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 0;
  top: 0;
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
  outline: 2px solid white;
}

.derivate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
  outline: 2px solid white;
}
</style>