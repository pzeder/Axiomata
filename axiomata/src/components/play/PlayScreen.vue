<template>
  <div class="screen-container">
    <HeadBar :levelTitle="level?.title" :bonusLevel="level?.bonus" :height="headBarHeight"
      @openLevelMenu="emit('openLevelSelection')" />
    <div :style="{ display: 'flex' }">
      <AxiomBar :title="'Tausch-Regeln'" background="rgb(252, 223, 203)" :width="axiomBarWidth" :height="axiomBarHeight"
        :axioms="axioms" :symbols="symbols" :variables="variables" @selectAxiom="selectAxiom" />
      <div class="right-side">
        <div :style="{ display: 'flex' }">
          <div :style="{ marginTop: -1 + 'vw' }">
            <SequenceContainer :width="workbenchWidth" :height="workbenchHeight" :maxFill="workbenchMaxFill"
              :maxSymbolWidthRatio="workbenchMaxSymbolWidthRatio" :sequence="workSequence" :symbols="symbols"
              :variables="variables" :highlights="workHighlights" borderColor="rgb(89, 204, 245)" />
          </div>
          <div :style="{ display: 'grid', placeItems: 'center', width: goalContainerWidth + 'vw' }">
            <SequenceContainer class="goal-window" :header="'START'" :width="goalWidth" :height="goalWidth" :maxFill="0.6"
              :maxSymbolWidthRatio="0.33" :sequence="level && level.goalAxiom ? level.goalAxiom.upperSequence : null"
              :variables="variables" :symbols="symbols" borderColor="orange" />
            <TextButton text="Rückgängig" @click="{ emit('undoMove'); dropAxiom() }"
              :background="level && level.moveHistory && level.moveHistory.length > 0 ? 'white' : 'red'" />
            <SequenceContainer class="goal-window" :header="'ZIEL'" :width="goalWidth" :height="goalWidth" :maxFill="0.6"
              :maxSymbolWidthRatio="0.33" :sequence="level && level.goalAxiom ? level.goalAxiom.lowerSequence : null"
              :variables="variables" :symbols="symbols" borderColor="orange" :footer="goalMatch ? 'Geschafft!' : ''"
              @click="handleGoalClick" />
          </div>
        </div>
        <AxiomBar :title="'Bonus-Regeln'" :background="'rgb(187, 231, 247)'" :width="derivateBarWidth"
          :height="derivateBarHeight" :axioms="derivates" :variables="variables" :symbols="symbols"
          @selectAxiom="selectAxiom" />
      </div>
    </div>
  </div>
  <Cursor v-if="showCursorAxiom" :posX="cursorAxiomX" :posY="cursorAxiomY" :cursorAxiom="cursorAxiom"
    :symbolWidth="workSymbolWidth" :symbols="symbols" :upperHighlights="upperHighlights"
    :lowerHighlights="lowerHighlights" :aboveCenter="cursorAboveCenter" :workMatch="workMatch" :variables="variables"
    :varMap="varMap" @dropAxiom="dropAxiom" @cursorAxiomClicked="cursorAxiomClicked" @swap="swap" />
  <BonusAxiomWindow v-if="showBonusAxiom && level && symbols && variables" :level="level" :symbols="symbols"
    :variables="variables" :bonusAxiomGrabed="bonusAxiomGrabed" :levelFinished="levelFinished"
    @grabBonusAxiom="grabBonusAxiom" @finishLevel="emit('finishLevel')" />
</template>

<script setup lang=ts>
import AxiomBar from './AxiomBar.vue';
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import HeadBar from '@/components/play/HeadBar.vue'
import Cursor from './Cursor.vue';
import { AxiomData, LevelData, SymbolPointer, SymbolData, MoveData, SymbolType } from '@/scripts/Interfaces';
import { Ref, ref, defineProps, defineEmits, onMounted, onBeforeUnmount, computed, ComputedRef } from 'vue';
import { axiomHeight, axiomWidth } from '@/scripts/AxiomMethods';
import BonusAxiomWindow from './BonusAxiomWindow.vue';
import TextButton from '../UI/TextButton.vue';

interface Props {
  symbols: SymbolData[] | undefined;
  variables: SymbolData[] | undefined;
  axioms: AxiomData[];
  derivates: AxiomData[];
  level: LevelData | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevelSelection', 'finishLevel', 'addMove', 'nextLevel', 'undoMove']);

const showCursorAxiom: Ref<boolean> = ref(false);
const showBonusAxiom: Ref<boolean> = ref(false);
const bonusAxiomGrabed: Ref<boolean> = ref(false);
const levelFinished: Ref<boolean> = ref(false);
const derivates: Ref<AxiomData[]> = ref(props.derivates);

// Layout variables
const screenRatio: Ref<number> = ref(window.innerWidth / window.innerHeight);
const headBarHeight: Ref<number> = ref(3)
const axiomBarWidth: Ref<number> = ref(15);
const axiomBarHeight: Ref<number> = ref(100);
const derivateBarWidth: Ref<number> = ref(100);
const derivateBarHeight: Ref<number> = ref(15);
const workbenchX: ComputedRef<number> = computed(() => axiomBarWidth.value);
const workbenchY: ComputedRef<number> = computed(() => headBarHeight.value - 1); // -1 because of margin-top of workbench
const workbenchWidth: ComputedRef<number> = computed(() => 100 - axiomBarWidth.value - goalContainerWidth.value);
const workbenchHeight: ComputedRef<number> = computed(() => 100 / screenRatio.value - (headBarHeight.value + derivateBarHeight.value) + 1); // + 1 because of margin-top of workbench
const workbenchMaxFill: Ref<number> = ref(0.6);
const workbenchMaxSymbolWidthRatio: Ref<number> = ref(0.05);
const goalContainerWidth: Ref<number> = ref(15);
const goalWidth: Ref<number> = ref(10);
const workSymbolWidth: ComputedRef<number> = computed(() => {
  if (!workSequence.value) {
    return 0;
  }
  const w: number = workbenchMaxFill.value * workbenchWidth.value / workSequence.value.length;
  const maxWidth: number = workbenchMaxSymbolWidthRatio.value * workbenchWidth.value;
  return Math.min(w, maxWidth);
});

// Level variables
const goalMatch: ComputedRef<boolean> = computed(() => {
  if (!workSequence.value || !props.level || workSequence.value?.length !== props.level.goalAxiom?.lowerSequence.length) {
    return false;
  }
  for (let i = 0; i < workSequence.value.length; i++) {
    const workSymbol: SymbolPointer = workSequence.value[i];
    const goalSymbol: SymbolPointer = props.level.goalAxiom.lowerSequence[i]
    if (workSymbol.type !== goalSymbol.type || workSymbol.index !== goalSymbol.index) {
      return false;
    }
  }
  return true;
});

// Workbench variables
const dockIndex: Ref<number> = ref(0);
const workHighlights: Ref<boolean[]> = ref([]);

// Cursor variables
const cursorAxiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });
const cursorAxiomX: Ref<number> = ref(0);
const cursorAxiomY: Ref<number> = ref(0);
const dragging: Ref<boolean> = ref(false);
const upperHighlights: Ref<boolean[]> = ref([]);
const lowerHighlights: Ref<boolean[]> = ref([]);
const cursorAboveCenter: Ref<boolean> = ref(false);
let nearSequence: SymbolPointer[];
let farSequence: SymbolPointer[];
let nearHighlights: Ref<boolean[]>;
const cursorAxiomDocked: Ref<boolean> = ref(false);
const varMap: Ref<Map<number, SymbolPointer>> = ref(new Map<number, SymbolPointer>());

const workSequence: ComputedRef<SymbolPointer[] | null> = computed(() => {
  if (!props.level || !props.level.goalAxiom) {
    return null;
  }
  if (props.level.moveHistory.length === 0) {
    return props.level.goalAxiom.upperSequence;
  }
  const lastIndex: number = props.level.moveHistory.length - 1;
  const lastMove: MoveData = props.level.moveHistory[lastIndex];
  return lastMove.sequence;
});


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
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', dropAxiom, { passive: false });
});

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll');
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', updateCursorAxiomPos);
  window.removeEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', dropAxiom);
});

function handleMouseDown(event: MouseEvent) {
  dragging.value = true;
  resetHighlights();
  cursorAxiomDocked.value = false;
  varMap.value.clear();
  updateCursorAxiomPos(event);
}

function handleResize() {
  screenRatio.value = window.innerWidth / window.innerHeight;
  dropAxiom();
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault();
  let touch = event.touches[0];
  updateCursorAxiomPos(touch);
}

function resetHighlights() {
  workHighlights.value = new Array(workSequence.value?.length).fill(false);
  upperHighlights.value = new Array(cursorAxiom.value.upperSequence.length).fill(false);
  lowerHighlights.value = new Array(cursorAxiom.value.lowerSequence.length).fill(false);
}

function dropAxiom(): void {
  if (bonusAxiomGrabed.value) {
    dropBonusAxiom();
  } else {
    dropNormalAxiom();
  }
}

function dropNormalAxiom(): void {
  if (!workSymbolWidth.value || cursorAxiom.value.upperSequence.length === 0) {
    return;
  }

  const centerX: number = cursorAxiomX.value + axiomWidth(cursorAxiom.value, workSymbolWidth.value) / 2;
  const centerY: number = cursorAxiomY.value + axiomHeight(workSymbolWidth.value) / 2;

  // Remove the selected Axiom if the mouse is NOT inside workbench

  if (!(centerX > workbenchX.value && centerX < workbenchX.value + workbenchWidth.value
    && centerY > workbenchY.value && centerY < workbenchY.value + workbenchHeight.value)) {
    showCursorAxiom.value = false;
    return;
  }

  dockCursorAxiom();
  updateMatching();
}

function dropBonusAxiom(): void {
  if (!props.level || !props.level.goalAxiom) {
    return;
  }

  showCursorAxiom.value = false;
  bonusAxiomGrabed.value = false;

  if (cursorAxiomY.value > workbenchY.value + workbenchHeight.value) {
    derivates.value.push(props.level.goalAxiom);
    levelFinished.value = true;
  }
}

function dockCursorAxiom(): void {
  if (!workSequence.value || !workSequence.value.length || !workSymbolWidth.value) {
    return;
  }

  const vx: number = cursorAxiomX.value;
  const vy: number = cursorAxiomY.value;
  const cursorCenterY: number = vy + axiomHeight(workSymbolWidth.value) / 2;

  /* Check if selected Axiom is in the upper or lower half of the workbench and
    snap it to the workSequence accordingly */

  const workbenchCenterY: number = workbenchY.value + workbenchHeight.value / 2;
  const workSequenceX: number = workbenchX.value + (workbenchWidth.value - workSequence.value.length * workSymbolWidth.value) / 2;
  const upperLength: number = cursorAxiom.value.upperSequence.length;
  const lowerLength: number = cursorAxiom.value.lowerSequence.length;
  let axiomOffset: number;
  if (cursorCenterY < workbenchCenterY) {
    // Upper Half
    axiomOffset = (upperLength <= lowerLength) ? 0 : ((upperLength - lowerLength) * 0.5 * workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY - workSymbolWidth.value * 0.5 - axiomHeight(workSymbolWidth.value);
    nearSequence = cursorAxiom.value.lowerSequence;
    farSequence = cursorAxiom.value.upperSequence;
    nearHighlights = lowerHighlights;
    cursorAboveCenter.value = true;
  } else {
    // Lower half
    axiomOffset = (lowerLength <= upperLength) ? 0 : ((lowerLength - upperLength) * 0.5 * workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY + workSymbolWidth.value * 0.5;
    nearSequence = cursorAxiom.value.upperSequence;
    farSequence = cursorAxiom.value.lowerSequence;
    nearHighlights = upperHighlights;
    cursorAboveCenter.value = false;
  }

  dockIndex.value = Math.round((vx + axiomOffset - workSequenceX) / workSymbolWidth.value);
  cursorAxiomX.value = workSequenceX + dockIndex.value * workSymbolWidth.value - axiomOffset;

  dragging.value = false;
  cursorAxiomDocked.value = true;
}

function updateMatching(): void {
  if (!props.level || !workSequence.value || !workSequence.value.length || !props.symbols || !props.variables) {
    return;
  }

  let workIndex: number = dockIndex.value;
  let nearIndex = 0;

  if (workIndex < 0) {
    nearIndex -= workIndex;
    workIndex = 0;
  }

  // Reset map
  varMap.value.clear();

  while (workIndex < workSequence.value.length && nearIndex < nearSequence.length) {
    let workSymbol: SymbolPointer = workSequence.value[workIndex];
    let nearSymbol: SymbolPointer = nearSequence[nearIndex];
    if (nearSymbol.type === SymbolType.VARIABLE) {
      let key: number = nearSymbol.index;
      if (!varMap.value.get(key) && props.symbols[workSymbol.index].varTarget) {
        varMap.value.set(key, workSymbol);
      }
      const symbolPointer: SymbolPointer | undefined = varMap.value.get(key);
      if (symbolPointer !== undefined) {
        nearSymbol = symbolPointer;
      }
    }
    const match: boolean = (workSymbol.type === nearSymbol.type && workSymbol.index === nearSymbol.index);
    workHighlights.value[workIndex] = match;
    nearHighlights.value[nearIndex] = match;
    workIndex++;
    nearIndex++;
  }
}

function grabBonusAxiom(event: MouseEvent, axiom: AxiomData) {
  bonusAxiomGrabed.value = true;
  selectAxiom(event, axiom);
}

function selectAxiom(event: MouseEvent, axiom: AxiomData): void {
  cursorAxiom.value = ({
    upperSequence: [...axiom.upperSequence],
    lowerSequence: [...axiom.lowerSequence]
  });
  handleMouseDown(event);
  showCursorAxiom.value = true;
}

function updateCursorAxiomPos(event: MouseEvent | Touch): void {
  if (!dragging.value || !workSymbolWidth.value) {
    return;
  }
  const mouseX: number = event.clientX / window.innerWidth * 100;
  const mouseY: number = event.clientY / window.innerWidth * 100;
  const width: number = axiomWidth(cursorAxiom.value, workSymbolWidth.value);
  const height: number = axiomHeight(workSymbolWidth.value);
  cursorAxiomX.value = mouseX - width / 2;
  cursorAxiomY.value = mouseY - height / 2;
}

function cursorAxiomClicked(): void {
  dragging.value = true;
  resetHighlights();
  cursorAxiomDocked.value = false;
  varMap.value.clear();
}

function swap(): void {
  updateWorkSequence();
  showCursorAxiom.value = false;
  resetHighlights();
  cursorAxiomDocked.value = false;
}

function updateWorkSequence(): void {
  if (!workSequence.value) {
    return;
  }

  let newSequence: SymbolPointer[] = [];

  // Keep all symbols left of the match

  for (let i = 0; i < dockIndex.value; i++) {
    newSequence.push(workSequence.value[i]);
  }

  // Replace the matching part with farSequence

  const mapVariable = (sp: SymbolPointer): SymbolPointer => {
    if (sp.type === SymbolType.VARIABLE) {
      const key: number = sp.index;
      const spMap: SymbolPointer | undefined = varMap.value.get(key);
      if (spMap !== undefined) {
        return spMap;
      }
    }
    return sp;
  };

  newSequence.push(...farSequence.map(mapVariable));

  // Keep all symbols left of the match

  for (let i = dockIndex.value + nearSequence.length; i < workSequence.value.length; i++) {
    newSequence.push(workSequence.value[i]);
  }

  // Create a new move and send it upwards to be added to the moveHistory

  const newMove: MoveData = ({
    axiom: cursorAxiom.value,
    sequence: newSequence
  });

  emit('addMove', newMove);
}

function handleGoalClick(): void {
  if (!props.level || !goalMatch.value) {
    return;
  }
  if (!props.level?.bonus) {
    emit('finishLevel');
    return;
  }
  showCursorAxiom.value = false;
  showBonusAxiom.value = true;
}
</script>

<style>
.screen-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.right-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.no-scroll {
  overflow: hidden;
  height: 100%;
}
</style>