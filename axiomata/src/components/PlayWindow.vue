<template>
  <div class="headbar" :style="{ height: headBarHeight + 'vh' }">
    <button :style="{ position: 'relative' }" @click="openLevelMenu"> Zurück </button>
    <div :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 + '%' }">
      <div :style="{ color: 'white' }"> {{ userState.levelName }} </div>
    </div>
  </div>
  <div class="workbench" :style="{
    left: workbenchX + 'vw',
    top: workbenchY + 'vh',
    width: workbenchWidth + 'vw',
    height: workbenchHeight + 'vh'
  }" @mouseenter="() => { mouseOverWorkbench = true }" @mouseleave="() => { mouseOverWorkbench = false }">
    <button class="magic" v-if="!levelFinsihed" @click="finishLevel"> Magischer Knopf </button>
    <div class="finish" v-if="levelFinsihed"> Level geschafft! <br>
      <button @click="openLevelMenu"> zurück zur Levelauswahl </button>
    </div>
  </div>
  <div class="derivate-bar"
    :style="{ left: derivateBarX + 'vw', width: derivateBarWidth + 'vw', height: derivateBarHeight + 'vh' }">
    <div class="derivate-container" v-for="axiom in levelData.derivates" :key="axiom.name">
      <Axiom :axiomData="axiom" @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <div class="axiom-bar" :style="{ top: axiomBarY + 'vh', width: axiomBarWidth + 'vw', height: axiomBarHeight + 'vh' }">
    <div class="axiom-container" v-for="axiom in levelData.axioms" :key="axiom.name">
      <Axiom :axiomData="axiom" @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <div class="goal-container" :style="{ top: goalY + 'vh', width: goalWidth + 'vw', height: goalHeight + 'vw' }">
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
    backgroundColor: 'black',
  }" @mouseup="handleMouseUp" @mousedown="() => { draggingAxiom = true }">
    <Axiom :axiomData="selectedAxiom" :key="selectedAxiom.name" />
  </div>
</template>

<script setup lang=ts>
import Axiom from '@/components/Axiom.vue';
import { UserState, AxiomData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef } from 'vue';

interface Props {
  userState: UserState;
}
const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

interface LevelData {
  axioms: AxiomData[];
  derivates: AxiomData[];
}

// Layout variables
const headBarHeight: Ref<number> = ref(5);
const axiomBarY: Ref<number> = ref(5);
const axiomBarWidth: Ref<number> = ref(20);
const axiomBarHeight: Ref<number> = ref(100);
const derivateBarX: Ref<number> = ref(20);
const derivateBarWidth: Ref<number> = ref(100);
const derivateBarHeight: Ref<number> = ref(25);
const workbenchX: Ref<number> = ref(20);
const workbenchY: Ref<number> = ref(5);
const workbenchWidth: Ref<number> = ref(80);
const workbenchHeight: Ref<number> = ref(65);
const goalY: Ref<number> = ref(5);
const goalWidth: Ref<number> = ref(10);
const goalHeight: Ref<number> = ref(10);

// Data variables
const levelData: Ref<LevelData> = ref({ axioms: [], derivates: [] });
const levelFinsihed: Ref<boolean> = ref(false);
const selectedAxiom: Ref<AxiomData> = ref({ name: "" });
const selectedAxiomX: Ref<number> = ref(0);
const selectedAxiomY: Ref<number> = ref(0);
const draggingAxiom: Ref<boolean> = ref(false);
const mouseOverWorkbench: Ref<boolean> = ref(false);

onMounted(() => {
  window.addEventListener('mousemove', updateSelectedAxiomPos);
  fetchLevel();
});

const emit = defineEmits(['openLevelMenu']);

function openLevelMenu(): void {
  emit('openLevelMenu');
}

function handleMouseUp(event: MouseEvent) {
  draggingAxiom.value = false;
  if (!isOnWorkbench(event.clientX, event.clientY)) {
    selectedAxiom.value.name = '';
  }
}

function isOnWorkbench(xpos: number, ypos: number): boolean {
  const vx: number = xpos / window.innerWidth * 100;
  const vy: number = ypos / window.innerHeight * 100;
  if (vx > workbenchX.value && vx < workbenchX.value + workbenchWidth.value
    && vy > workbenchY.value && vy < workbenchY.value + workbenchHeight.value) {
    return true;
  }
  return false;
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
  selectedAxiom.value.name = axiom.name;
  draggingAxiom.value = true;
}

function updateSelectedAxiomPos(event: MouseEvent) {
  if (draggingAxiom.value) {
    selectedAxiomX.value = event.clientX;
    selectedAxiomY.value = event.clientY;
  }
}
</script>

<style>
.headbar {
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  background: rgb(89, 204, 245);
  position: absolute
}

.workbench {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
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
  position: absolute;
  left: 0;
  background: rgb(252, 223, 203);
  color: #fff;
}

.derivate-bar {
  display: flex;
  position: absolute;
  bottom: 0;
  background: rgb(208, 237, 248);
  color: #fff;
}

.goal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
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