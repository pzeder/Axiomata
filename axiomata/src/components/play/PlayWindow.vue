<template>
  <HeadBar :height="headBarHeight" :levelName="levelData.levelName" @openLevelMenu="emit('openLevelMenu')" />
  <SequenceContainer class="workbench" :posX="workbenchX" :posY="workbenchY" :width="workbenchWidth"
    :height="workbenchHeight" :maxFill="workbenchMaxFill" :maxSymbolWidthRatio="workbenchMaxSymbolWidthRatio"
    :screenRatio="screenRatio" :sequence="workSequence" :symbolAlphabet="levelData.symbolAlphabet"
    :variables="levelData.variables" :varColors="varColors" :highlights="workHighlights" />
  <AxiomBar :title="'Bonus-Regeln'" :background="'rgb(187, 231, 247)'" :posX="derivateBarX" :posY="derivateBarY"
    :width="derivateBarWidth" :height="derivateBarHeight" :screenRatio="screenRatio" :axioms="levelData.derivates"
    :variables="levelData.variables" :varColors="varColors" :symbolAlphabet="levelData.symbolAlphabet"
    @selectAxiom="selectAxiom" />
  <AxiomBar :title="'Tausch-Regeln'" :background="'rgb(252, 223, 203)'" :posX="axiomBarX" :posY="axiomBarY"
    :width="axiomBarWidth" :height="axiomBarHeight" :screenRatio="screenRatio" :axioms="levelData.axioms"
    :symbolAlphabet="levelData.symbolAlphabet" :variables="levelData.variables" :varColors="varColors"
    @selectAxiom="selectAxiom" />
  <SequenceContainer class="goal-window" :title="'ZIEL'" :posX="goalX" :posY="goalY" :width="goalWidth"
    :height="goalWidth * screenRatio" :maxFill="0.8" :maxSymbolWidthRatio="0.33" :screenRatio="screenRatio"
    :sequence="levelData.goalAxiom.lowerSequence" :variables="levelData.variables" :varColors="varColors"
    :symbolAlphabet="levelData.symbolAlphabet" />
  <VictoryWindow v-if="levelData.levelFinished" :posX="workbenchX" :posY="headBarHeight" :width="workbenchWidth"
    :height="workbenchHeight" :hasNextLevel="hasNextLevel" @openLevelMenu="emit('openLevelMenu')"
    @nextLevel="emit('nextLevel')" />
  <Cursor :posX="cursorAxiomX" :posY="cursorAxiomY" :cursorAxiom="cursorAxiom" :symbolWidth="workSymbolWidth"
    :symbolAlphabet="levelData.symbolAlphabet" :upperHighlights="upperHighlights" :lowerHighlights="lowerHighlights"
    :centerDirectionY="centerDirectionY" :screenRatio="screenRatio" :workMatch="workMatch"
    :variables="levelData.variables" :varColors="varColors" :varMap="varMap" @axiomDrop="axiomDrop"
    @cursorAxiomClicked="cursorAxiomClicked" @swap="swap" />
  <div v-if="goalMatch" @click="finishLevel"
    :style="{ position: 'absolute', userSelect: 'none', color: 'black', left: (goalX + goalWidth / 2) + 'vw', top: (goalY + goalWidth * screenRatio / 2) + 'vh', width: (goalWidth) + 'vw', height: (goalWidth * screenRatio) + 'vh' }">
    MATCH
  </div>
</template>

<script setup lang=ts>
import AxiomBar from './AxiomBar.vue';
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import VictoryWindow from './VictoryWindow.vue';
import HeadBar from '@/components/play/HeadBar.vue'
import Cursor from './Cursor.vue';
import { AxiomData, LevelData, SeqVar, SeqSymbol, VarData } from '@/scripts/Interfaces';
import { Ref, ref, defineProps, defineEmits, onMounted, onBeforeUnmount, computed, ComputedRef } from 'vue';
import { axiomHeight, axiomWidth } from '@/scripts/AxiomMethods';

interface Props {
  levelData: LevelData;
  hasNextLevel: boolean;
}
const props = defineProps<Props>();

// Layout variables
const screenRatio: Ref<number> = ref(window.innerWidth / window.innerHeight);
const headBarHeight: Ref<number> = ref(5);
const axiomBarX: Ref<number> = ref(0);
const axiomBarY: Ref<number> = ref(5);
const axiomBarWidth: Ref<number> = ref(20);
const axiomBarHeight: Ref<number> = ref(100);
const derivateBarX = computed(() => axiomBarWidth.value);
const derivateBarY = computed(() => workbenchY.value + workbenchHeight.value);
const derivateBarWidth: Ref<number> = ref(100);
const derivateBarHeight: Ref<number> = ref(25);
const workbenchX: Ref<number> = ref(20);
const workbenchY: Ref<number> = ref(5);
const workbenchWidth: Ref<number> = ref(80);
const workbenchHeight: Ref<number> = ref(70);
const workbenchMaxFill: Ref<number> = ref(0.6);
const workbenchMaxSymbolWidthRatio: Ref<number> = ref(0.05);
const goalX: Ref<number> = ref(88);
const goalY: Ref<number> = ref(5);
const goalWidth: Ref<number> = ref(10);
const workSymbolWidth: ComputedRef<number> = computed(() => {
  const w: number = workbenchMaxFill.value * workbenchWidth.value / workSequence.value.length;
  const maxWidth: number = workbenchMaxSymbolWidthRatio.value * workbenchWidth.value;
  return Math.min(w, maxWidth);
});
const varColors: Ref<string[]> = ref(['red', 'blue', 'green', 'purple', 'orange']);

// Level variables
const goalMatch: ComputedRef<boolean> = computed(() => {
  if (workSequence.value.length !== props.levelData.goalAxiom.lowerSequence.length) {
    return false;
  }
  for (let i = 0; i < workSequence.value.length; i++) {
    if (workSequence.value[i] !== props.levelData.goalAxiom.lowerSequence[i]) {
      return false;
    }
  }
  return true;
});

// Cursor variables
const cursorAxiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });
const cursorAxiomX: Ref<number> = ref(0);
const cursorAxiomY: Ref<number> = ref(0);
const dragging: Ref<boolean> = ref(false);

// Workbench variables
const dockIndex: Ref<number> = ref(0);
const workHighlights: Ref<boolean[]> = ref([]);

// Cursor variables
const upperHighlights: Ref<boolean[]> = ref([]);
const lowerHighlights: Ref<boolean[]> = ref([]);
const centerDirectionY: Ref<number> = ref(0);
let nearSequence: SeqSymbol[];
let farSequence: SeqSymbol[];
let nearHighlights: Ref<boolean[]>;
const cursorAxiomDocked: Ref<boolean> = ref(false);
const varMap: Ref<Map<string, number>> = ref(new Map<string, number>());
const workSequence: ComputedRef<SeqSymbol[]> = computed(() =>
  props.levelData.sequenceHistory[props.levelData.sequenceHistory.length - 1]);
const workMatch: ComputedRef<boolean> = computed(() => {
  let docked: boolean = cursorAxiomDocked.value;
  if (!nearHighlights || nearHighlights.value.length === 0 || !docked) {
    return false;
  }
  return (nearHighlights.value.filter(b => !b).length === 0);
});

onMounted(() => {
  document.body.classList.add('no-scroll');
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', updateCursorAxiomPos);
});

const emit = defineEmits(['openLevelMenu', 'levelFinished', 'updateSequenceHistory', 'nextLevel']);

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll');
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', updateCursorAxiomPos);
});

function handleMouseDown() {
  dragging.value = true;
  resetHighlights();
  cursorAxiomDocked.value = false;
  varMap.value.clear();
}

function handleResize() {
  screenRatio.value = window.innerWidth / window.innerHeight;
  axiomDrop();
}

function resetHighlights() {
  workHighlights.value = new Array(workSequence.value.length).fill(false);
  upperHighlights.value = new Array(cursorAxiom.value.upperSequence.length).fill(false);
  lowerHighlights.value = new Array(cursorAxiom.value.lowerSequence.length).fill(false);
}

function axiomDrop(): void {
  if (cursorAxiom.value.upperSequence.length === 0) {
    return;
  }

  const centerX: number = cursorAxiomX.value + axiomWidth(cursorAxiom.value, workSymbolWidth.value) / 2;
  const centerY: number = cursorAxiomY.value + axiomHeight(workSymbolWidth.value, screenRatio.value) / 2;

  // Remove the selected Axiom if the mouse is NOT inside workbench

  if (!(centerX > workbenchX.value && centerX < workbenchX.value + workbenchWidth.value
    && centerY > workbenchY.value && centerY < workbenchY.value + workbenchHeight.value)) {
    cursorAxiom.value.upperSequence = [];
    return;
  }

  dockCursorAxiom();
  updateMatching();
}

function dockCursorAxiom(): void {
  const vx: number = cursorAxiomX.value;
  const vy: number = cursorAxiomY.value;

  /* Check if selected Axiom is in the upper or lower half of the workbench and
    snap it to the workSequence accordingly */

  const workbenchCenterY: number = workbenchY.value + workbenchHeight.value / 2;
  const workSequenceX: number = workbenchX.value + (workbenchWidth.value - workSequence.value.length * workSymbolWidth.value) / 2;
  const symbolHeight: number = workSymbolWidth.value * screenRatio.value;
  const upperLength: number = cursorAxiom.value.upperSequence.length;
  const lowerLength: number = cursorAxiom.value.lowerSequence.length;
  let axiomOffset: number;
  if (vy < workbenchCenterY) {
    // Upper Half
    axiomOffset = (upperLength <= lowerLength) ? 0 : ((upperLength - lowerLength) / 2 * workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY - 6 * symbolHeight / 2;
    nearSequence = cursorAxiom.value.lowerSequence;
    farSequence = cursorAxiom.value.upperSequence;
    nearHighlights = lowerHighlights;
    centerDirectionY.value = 1;
  } else {
    // Lower half
    axiomOffset = (lowerLength <= upperLength) ? 0 : ((lowerLength - upperLength) / 2 * workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY + symbolHeight / 2;
    nearSequence = cursorAxiom.value.upperSequence;
    farSequence = cursorAxiom.value.lowerSequence;
    nearHighlights = upperHighlights;
    centerDirectionY.value = -1;
  }

  dockIndex.value = Math.round((vx + axiomOffset - workSequenceX) / workSymbolWidth.value);
  cursorAxiomX.value = workSequenceX + dockIndex.value * workSymbolWidth.value - axiomOffset;

  dragging.value = false;
  cursorAxiomDocked.value = true;
}

function updateMatching(): void {
  let workIndex: number = dockIndex.value;
  let nearIndex = 0;

  if (workIndex < 0) {
    nearIndex -= workIndex;
    workIndex = 0;
  }

  // Reset map
  varMap.value = new Map<string, number>();

  while (workIndex < workSequence.value.length && nearIndex < nearSequence.length) {
    let workSymbol: SeqSymbol = workSequence.value[workIndex];
    let nearSymbol: SeqSymbol = nearSequence[nearIndex];
    let match: boolean = false;
    if (typeof nearSymbol === 'number') {
      match = (workSymbol === nearSymbol);
    } else if ('varIndex' in nearSymbol && 'colorIndex' in nearSymbol) {
      let variable = nearSymbol as SeqVar;
      let varData: VarData = props.levelData.variables[variable.varIndex];
      let workSymbolIndex: number = workSymbol as number;
      let key: string = `${variable.varIndex},${variable.colorIndex}`;
      if (!varMap.value.get(key) && varData.possibilities.includes(workSymbolIndex)) {
        varMap.value.set(key, workSymbolIndex);
      }
      match = (varMap.value.get(key) === workSymbolIndex);
    }
    workHighlights.value[workIndex] = match;
    nearHighlights.value[nearIndex] = match;
    workIndex++;
    nearIndex++;
  }
}

function finishLevel(): void {
  emit('levelFinished');
}

function selectAxiom(axiom: AxiomData): void {
  cursorAxiom.value = ({
    upperSequence: [...axiom.upperSequence],
    lowerSequence: [...axiom.lowerSequence]
  });
  handleMouseDown();
}

function updateCursorAxiomPos(event: MouseEvent) {
  if (dragging.value) {
    const mouseX: number = event.clientX / window.innerWidth * 100;
    const mouseY: number = event.clientY / window.innerHeight * 100;
    const width: number = axiomWidth(cursorAxiom.value, workSymbolWidth.value);
    const height: number = axiomHeight(workSymbolWidth.value, screenRatio.value);
    cursorAxiomX.value = mouseX - width / 2;
    cursorAxiomY.value = mouseY - height / 2;
  }
}

function cursorAxiomClicked(): void {
  dragging.value = true;
  resetHighlights();
  cursorAxiomDocked.value = false;
  varMap.value.clear();
}

function swap(): void {
  updateWorkSequence();
  cursorAxiom.value.upperSequence = [];
  resetHighlights();
  cursorAxiomDocked.value = false;
}

function updateWorkSequence(): void {
  let newSequence: SeqSymbol[] = [];

  // Keep all symbols left of the match

  for (let i = 0; i < dockIndex.value; i++) {
    newSequence.push(workSequence.value[i]);
  }

  // Replace the matching part with farSequence

  newSequence.push(...farSequence.map(symbol => {
    if (typeof symbol !== 'number' && 'varIndex' in symbol && 'colorIndex' in symbol) {
      const variable = symbol as SeqVar;
      let key: string = `${variable.varIndex},${variable.colorIndex}`;
      if (varMap.value.get(key) || varMap.value.get(key) === 0) {
        return varMap.value.get(key) as number;
      }
    }
    return symbol;
  }));

  // Keep all symbols left of the match

  for (let i = dockIndex.value + nearSequence.length; i < workSequence.value.length; i++) {
    newSequence.push(workSequence.value[i]);
  }

  emit('updateSequenceHistory', newSequence);
}
</script>

<style>
.goal-window {
  background-color: #ffffff;
  border: 1vw solid rgb(63, 196, 244);
}

.no-scroll {
  overflow: hidden;
  height: 100%;
}
</style>