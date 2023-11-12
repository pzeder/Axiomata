<template>
  <div class="headbar" :style="{ height: headBarHeight + 'vh' }">
    <button :style="{ position: 'relative', width: 5 + 'vw' }" @click="openLevelMenu"> Zurück </button>
    <div :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 + '%' }">
      <div :style="{ color: 'white' }"> {{ sessionState.levelName }} </div>
    </div>
  </div>
  <div class="workbench" :style="{
    left: workbenchX + 'vw',
    top: workbenchY + 'vh',
    width: workbenchWidth + 'vw',
    height: workbenchHeight + 'vh'
  }" @mouseenter="() => { mouseOverWorkbench = true }" @mouseleave="() => { mouseOverWorkbench = false }">
    <button class="magic" v-if="!levelFinsihed" @click="finishLevel"> Magischer Knopf </button>
    <Sequence :symbolWidth="symbolWidth" :screenRatio="screenRatio" :symbolIndices="workSequence" :highlights="[true, false, true, false]" :symbolAlphabet="levelData.symbolAlphabet" :style="{
      position: 'absolute',
      left: ((workbenchWidth - workSequence.length * symbolWidth) / 2) + 'vw',
      top: ((workbenchHeight - symbolWidth * screenRatio) / 2) + 'vh'
    }"/>
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
    <div class="axiom-container" v-for="(axiom, key) in levelData.axioms" :key="key">
      <Axiom :symbolWidth="5" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="levelData.symbolAlphabet" @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <div class="goal-container" :style="{ top: goalY + 'vh', width: goalWidth + 'vw', height: goalHeight + 'vw' }">
      ZIEL
  </div>
  <div :style="{
    position: 'absolute',
    left: selectedAxiomX + 'vw',
    top: selectedAxiomY + 'vh'
  }">
    <Axiom v-if="selectedAxiom.upperSequence.length !== 0" 
      :symbolWidth="symbolWidth" :screenRatio="screenRatio" :axiomData="selectedAxiom" :symbolAlphabet="levelData.symbolAlphabet"
      @mouseup="handleMouseUp" @mousedown="() => { draggingAxiom = true }" />
  </div>
</template>

<script setup lang=ts>
import Axiom from '@/components/play/Axiom.vue';
import Sequence from '@/components/play/Sequence.vue';
import { SessionState, AxiomData, SymbolData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef, onBeforeUnmount } from 'vue';

interface Props {
  sessionState: SessionState;
}
const props = defineProps<Props>();
const sessionState: Ref<SessionState> = ref(props.sessionState);

interface LevelData {
  symbolAlphabet: SymbolData[];
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
const workbenchHeight: Ref<number> = ref(70);
const goalY: Ref<number> = ref(5);
const goalWidth: Ref<number> = ref(10);
const goalHeight: Ref<number> = ref(10);
const symbolWidth: Ref<number> = ref(5);
const screenRatio: Ref<number> = ref(window.innerWidth / window.innerHeight);

// Data variables
const levelData: Ref<LevelData> = ref({ symbolAlphabet: [], axioms: [], derivates: [] });
const levelFinsihed: Ref<boolean> = ref(false);
const selectedAxiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });
const selectedAxiomX: Ref<number> = ref(0);
const selectedAxiomY: Ref<number> = ref(0);
const draggingAxiom: Ref<boolean> = ref(false);
const mouseOverWorkbench: Ref<boolean> = ref(false);
const workSequence: Ref<number[]> = ref([0,1,0,1]);
const dockIndex: Ref<number> = ref(0);

onMounted(() => {
  window.addEventListener('mousemove', updateSelectedAxiomPos);
  fetchLevel();
});

const emit = defineEmits(['openLevelMenu']);

function openLevelMenu(): void {
  emit('openLevelMenu');
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function handleMouseUp() {
  docking();
  checkMatching();
}

function handleResize() {
  screenRatio.value = window.innerWidth / window.innerHeight;
  handleMouseUp();
}

function docking(): void {
  const vx: number = selectedAxiomX.value;
  const vy: number = selectedAxiomY.value;

  // Drop the selected Axiom if the mouse is NOT inside workbench

  if (!(vx > workbenchX.value && vx < workbenchX.value + workbenchWidth.value
    && vy > workbenchY.value && vy < workbenchY.value + workbenchHeight.value)) {
    selectedAxiom.value.upperSequence = [];
  } 

  /* Check if selected Axiom is in the upper or lower half of the workbench and 
    snap it to the workSequence accordingly */

  const workbenchCenterY: number = workbenchY.value + workbenchHeight.value / 2;
  const workSequenceX: number = workbenchX.value + (workbenchWidth.value - workSequence.value.length * symbolWidth.value) / 2;
  const symbolHeight: number = symbolWidth.value * screenRatio.value;
  const upperLength: number = selectedAxiom.value.upperSequence.length;
  const lowerLength: number = selectedAxiom.value.lowerSequence.length;
  let axiomOffset: number;
  if (vy < workbenchCenterY) {
    // Upper Half
    axiomOffset = (upperLength <= lowerLength) ? 0 : ((upperLength - lowerLength) / 2 * symbolWidth.value);
    selectedAxiomY.value = workbenchCenterY - 6 * symbolHeight / 2;
  } else {
    // Lower half
    axiomOffset = (lowerLength <= upperLength) ? 0 : ((lowerLength - upperLength) / 2 * symbolWidth.value);
    selectedAxiomY.value = workbenchCenterY + symbolHeight / 2;
  }

  dockIndex.value = Math.round((vx + axiomOffset - workSequenceX) / symbolWidth.value);
  selectedAxiomX.value = workSequenceX + dockIndex.value * symbolWidth.value - axiomOffset;
  
  draggingAxiom.value = false;
}

function checkMatching(): void {
  let workIndex: number = dockIndex.value;
  let axiomIndex = 0;

  if (workIndex < 0) {
    axiomIndex -= workIndex;
    workIndex = 0;
  }

  // const nearSequence: number[] = 

  //while (workIndex < workSequence.value.length && axiomIndex < )   
}

function finishLevel(): void {
  levelFinsihed.value = true;
  updateCourse();
}

async function fetchLevel(): Promise<void> {
  try {
    const query: string = '?saveID=' + sessionState.value.saveID
      + '&chapterName=' + sessionState.value.chapterName
      + '&levelName=' + sessionState.value.levelName;
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

function addHighlights(): AxiomData

async function updateCourse(): Promise<void> {
  try {
    const updatedData = {
      saveID: sessionState.value.saveID,
      chapterName: sessionState.value.chapterName,
      levelName: sessionState.value.levelName,
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
  selectedAxiom.value = ({
    upperSequence: [...axiom.upperSequence],
    lowerSequence: [...axiom.lowerSequence]
  });
  draggingAxiom.value = true;
}

function updateSelectedAxiomPos(event: MouseEvent) {
  if (draggingAxiom.value) {
    const x: number = event.clientX / window.innerWidth * 100;
    const y: number = event.clientY / window.innerHeight * 100;
    selectedAxiomX.value = x - maxSequence(selectedAxiom.value) * symbolWidth.value / 2;
    selectedAxiomY.value = y - symbolWidth.value * screenRatio.value * 1.25; 
  }
}

function maxSequence(axiom: AxiomData): number {
  return Math.max(axiom.upperSequence.length, axiom.lowerSequence.length);
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
  position: absolute;
}

.magic {
  position: absolute;
  left: 0;
  top: 0;
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
  display: grid;
  place-items: center;
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
  height: 20vh;
}

.derivate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
}
</style>