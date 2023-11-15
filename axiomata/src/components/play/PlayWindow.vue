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
    <Sequence :symbolWidth="symbolWidth" :screenRatio="screenRatio" :symbolIndices="workSequence"
      :highlights="workHighlights" :symbolAlphabet="symbolAlphabet" :style="{
        position: 'absolute',
        left: ((workbenchWidth - workSequence.length * symbolWidth) / 2) + 'vw',
        top: ((workbenchHeight - symbolWidth * screenRatio) / 2) + 'vh'
      }" />
    <div class="finish" v-if="levelFinsihed"> Level geschafft! <br>
      <button @click="openLevelMenu"> zurück zur Levelauswahl </button>
    </div>
  </div>
  <div class="derivate-bar"
    :style="{ left: derivateBarX + 'vw', width: derivateBarWidth + 'vw', height: derivateBarHeight + 'vh' }">
    <div class="derivate-container" v-for="(axiom, index) in derivates" :key="index">
      <Axiom :symbolWidth="3" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="symbolAlphabet"
        @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
  <AxiomBar :posX="0" :posY="axiomBarY" :width="axiomBarWidth" :height="axiomBarHeight" :screenRatio="screenRatio"
    :axioms="axioms" :symbolAlphabet="symbolAlphabet" :isInserting="true" :insertionIndex="hoverBarIndex"
    @selectAxiom="selectAxiom" @mouseOver="index => axiomBarMouseOver('axiom', index)" />
  <div class="goal-container" :style="{ top: goalY + 'vh', width: goalWidth + 'vw', height: goalHeight + 'vw' }">
    <Sequence :symbolWidth="4" :screenRatio="screenRatio" :symbolIndices="goalAxiom.lowerSequence"
      :symbolAlphabet="symbolAlphabet" />
  </div>
  <div :style="{
    position: 'absolute',
    left: selectedAxiomX + 'vw',
    top: selectedAxiomY + 'vh'
  }">
    <Axiom v-if="selectedAxiom.upperSequence.length !== 0" :symbolWidth="symbolWidth" :screenRatio="screenRatio"
      :axiomData="selectedAxiom" :symbolAlphabet="symbolAlphabet" :upperHighlights="upperHighlights"
      :lowerHighlights="lowerHighlights" @mouseup="axiomDrop" @mousedown="handleMouseDown"> </Axiom>
    <div class="swap-button" v-if="workMatch" @click="handleSwapButton" :style="{
      display: 'grid',
      placeItems: 'center',
      position: 'absolute',
      left: ((Math.max(selectedAxiom.upperSequence.length, selectedAxiom.lowerSequence.length) - 1) * symbolWidth / 2) + 'vw',
      top: (centerDirectionY > 0 ? (-symbolWidth * screenRatio * 1.5) : (symbolWidth * screenRatio * 3)) + 'vh',
      width: symbolWidth + 'vw',
      height: (symbolWidth * screenRatio) + 'vh',
    }"> SWAP </div>
  </div>
</template>

<script setup lang=ts>
import Axiom from '@/components/play/Axiom.vue';
import Sequence from '@/components/play/Sequence.vue';
import AxiomBar from './AxiomBar.vue';
import { SessionState, AxiomData, SymbolData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef, onBeforeUnmount } from 'vue';
import { axiomHeight, axiomWidth } from '@/scripts/AxiomMethods';

interface Props {
  sessionState: SessionState;
}
const props = defineProps<Props>();
const sessionState: Ref<SessionState> = ref(props.sessionState);

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
const symbolWidth: Ref<number> = ref(3);
const screenRatio: Ref<number> = ref(window.innerWidth / window.innerHeight);

// Level variables
const symbolAlphabet: Ref<SymbolData[]> = ref([]);
const axioms: Ref<AxiomData[]> = ref([]);
const derivates: Ref<AxiomData[]> = ref([]);
const goalAxiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });
const levelFinsihed: Ref<boolean> = ref(false);
const sequenceHistory: Ref<number[][]> = ref([[]]);

// Cursor variables
const selectedAxiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });
const selectedAxiomX: Ref<number> = ref(0);
const selectedAxiomY: Ref<number> = ref(0);
const dragging: Ref<boolean> = ref(false);
const mouseOverWorkbench: Ref<boolean> = ref(false);

// Workbench variables
const dockIndex: Ref<number> = ref(0);
const workHighlights: Ref<boolean[]> = ref([]);
const upperHighlights: Ref<boolean[]> = ref([]);
const lowerHighlights: Ref<boolean[]> = ref([]);
const workMatch: Ref<boolean> = ref(false);
const centerDirectionY: Ref<number> = ref(0);
const workSequence: Ref<number[]> = ref([]);
let nearSequence: number[];
let farSequence: number[];
let nearHighlights: Ref<boolean[]>;

// AxiomBar variables
const hoverBarName: Ref<string> = ref("");
const hoverBarIndex: Ref<number> = ref(-1);

onMounted(() => {
  document.body.classList.add('no-scroll');
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', updateSelectedAxiomPos);
  fetchLevel();
});


const emit = defineEmits(['openLevelMenu']);

function openLevelMenu(): void {
  emit('openLevelMenu');
}

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll');
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', updateSelectedAxiomPos);
});

function handleMouseDown() {
  dragging.value = true;
  resetHighlights();
  workMatch.value = false;
}

function handleResize() {
  screenRatio.value = window.innerWidth / window.innerHeight;
  axiomDrop();
}

function axiomBarMouseOver(barName: string, index: number) {
  hoverBarName.value = barName;
  hoverBarIndex.value = index;
}

function resetHighlights() {
  workHighlights.value = new Array(workSequence.value.length).fill(false);
  upperHighlights.value = new Array(selectedAxiom.value.upperSequence.length).fill(false);
  lowerHighlights.value = new Array(selectedAxiom.value.lowerSequence.length).fill(false);
}

function axiomDrop(): void {
  if (selectedAxiom.value.upperSequence.length === 0) {
    return;
  }

  const centerX: number = selectedAxiomX.value + axiomWidth(selectedAxiom.value, symbolWidth.value) / 2;
  const centerY: number = selectedAxiomY.value + axiomHeight(symbolWidth.value, screenRatio.value) / 2;

  // Remove the selected Axiom if the mouse is NOT inside workbench

  if (!(centerX > workbenchX.value && centerX < workbenchX.value + workbenchWidth.value
    && centerY > workbenchY.value && centerY < workbenchY.value + workbenchHeight.value)) {
    selectedAxiom.value.upperSequence = [];
    return;
  }

  docking();
  updateMatching();
  workMatch.value = checkWorkMatch();
}

function docking(): void {
  const vx: number = selectedAxiomX.value;
  const vy: number = selectedAxiomY.value;

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
    nearSequence = selectedAxiom.value.lowerSequence;
    farSequence = selectedAxiom.value.upperSequence;
    nearHighlights = lowerHighlights;
    centerDirectionY.value = 1;
  } else {
    // Lower half
    axiomOffset = (lowerLength <= upperLength) ? 0 : ((lowerLength - upperLength) / 2 * symbolWidth.value);
    selectedAxiomY.value = workbenchCenterY + symbolHeight / 2;
    nearSequence = selectedAxiom.value.upperSequence;
    farSequence = selectedAxiom.value.lowerSequence;
    nearHighlights = upperHighlights;
    centerDirectionY.value = -1;
  }

  dockIndex.value = Math.round((vx + axiomOffset - workSequenceX) / symbolWidth.value);
  selectedAxiomX.value = workSequenceX + dockIndex.value * symbolWidth.value - axiomOffset;

  dragging.value = false;
}

function updateMatching(): void {
  let workIndex: number = dockIndex.value;
  let nearIndex = 0;

  if (workIndex < 0) {
    nearIndex -= workIndex;
    workIndex = 0;
  }

  while (workIndex < workSequence.value.length && nearIndex < nearSequence.length) {
    let b = workSequence.value[workIndex] === nearSequence[nearIndex];
    workHighlights.value[workIndex] = b;
    nearHighlights.value[nearIndex] = b;
    workIndex++;
    nearIndex++;
  }
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
      symbolAlphabet.value = response.data.symbolAlphabet;
      axioms.value = response.data.axioms;
      derivates.value = response.data.derivates;
      goalAxiom.value = response.data.goalAxiom;
      sequenceHistory.value = response.data.sequenceHistory;
      workSequence.value = sequenceHistory.value[sequenceHistory.value.length - 1];
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
      saveID: sessionState.value.saveID,
      chapterName: sessionState.value.chapterName,
      levelName: sessionState.value.levelName,
      newStatus: 'done'
    };
    const response = await axios.patch(`http://localhost:3000/levelEnd`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
    } else if (response.status === 400) {
      console.error(response.data.message);
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
  handleMouseDown();
}

function updateSelectedAxiomPos(event: MouseEvent) {
  if (dragging.value) {
    const mouseX: number = event.clientX / window.innerWidth * 100;
    const mouseY: number = event.clientY / window.innerHeight * 100;
    const width: number = axiomWidth(selectedAxiom.value, symbolWidth.value);
    const height: number = axiomHeight(symbolWidth.value, screenRatio.value);
    selectedAxiomX.value = mouseX - width / 2;
    selectedAxiomY.value = mouseY - height / 2;
  }
}

function checkWorkMatch(): boolean {
  if (!nearHighlights || nearHighlights.value.length === 0) {
    return false;
  }
  return (nearHighlights.value.filter(b => !b).length === 0);
}

function handleSwapButton(): void {
  swap();
  if (endOfGame()) {
    finishLevel();
  }
  selectedAxiom.value.upperSequence = [];
  resetHighlights();
  workMatch.value = false;
}

function swap(): void {
  const newLength: number = workSequence.value.length - nearSequence.length + farSequence.length;
  let newSequence: number[] = [];

  // Keep all symbols left of the match

  for (let i = 0; i < dockIndex.value; i++) {
    newSequence.push(workSequence.value[i]);
  }

  // Replace the matching part with farSequence

  newSequence.push(...farSequence);

  // Keep all symbols left of the match

  for (let i = dockIndex.value + nearSequence.length; i < workSequence.value.length; i++) {
    newSequence.push(workSequence.value[i]);
  }

  sequenceHistory.value.push(newSequence);
  workSequence.value = newSequence;

  updateSequenceHistory();
}

async function updateSequenceHistory(): Promise<void> {
  try {
    const updatedData = {
      saveID: sessionState.value.saveID,
      chapterName: sessionState.value.chapterName,
      levelName: sessionState.value.levelName,
      newHistory: sequenceHistory.value
    };
    const response = await axios.patch(`http://localhost:3000/sequenceHistory`, updatedData);
    if (response.status === 200) {
      console.log('Course updated successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function endOfGame(): boolean {
  if (workSequence.value.length !== goalAxiom.value.lowerSequence.length) {
    return false;
  }
  for (let i = 0; i < workSequence.value.length; i++) {
    if (workSequence.value[i] !== goalAxiom.value.lowerSequence[i]) {
      return false;
    }
  }
  return true;
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

.finish {
  position: absolute;
  font-size: 80pt;
  color: rgb(255, 157, 0);
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

.derivate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
}

.swap-button {
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background-color: green;
}

.no-scroll {
  overflow: hidden;
  height: 100%;
}
</style>