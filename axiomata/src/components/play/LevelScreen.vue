<template>
    <div class="screen-container">
      <HeadBar :levelTitle="level?.title" :height="headBarHeight" @openLevelMenu="emit('openChapterScreen')" />
      <div :style="{ display: 'flex'}">
        <AxiomBar :title="'Tausch-Regeln'" :background="'rgb(252, 223, 203)'"
          :width="axiomBarWidth" :height="axiomBarHeight" :axioms="axioms"
          :symbols="symbols" :variables="variables" :varColors="varColors"
          @selectAxiom="selectAxiom" />
        <div> 
          <div :style="{ display: 'flex' }">
            <SequenceContainer :width="workbenchWidth"
              :height="workbenchHeight" :maxFill="workbenchMaxFill" :maxSymbolWidthRatio="workbenchMaxSymbolWidthRatio"
              :sequence="workSequence" :symbols="symbols"
              :variables="variables" :varColors="varColors" :highlights="workHighlights" />
            <div :style="{ display: 'grid', placeItems: 'center'}">
              <SequenceContainer class="goal-window" :title="'START'" :posX="startX" :posY="startY" :width="goalWidth"
                :height="goalWidth" :maxFill="0.8" :maxSymbolWidthRatio="0.33" 
                :sequence="level?.goalAxiom.upperSequence" :variables="variables" :varColors="varColors"
                :symbols="symbols" />
              <SequenceContainer class="goal-window" :title="'ZIEL'" :posX="startX" :posY="goalY" :width="goalWidth"
                :height="goalWidth" :maxFill="0.8" :maxSymbolWidthRatio="0.33"
                :sequence="level?.goalAxiom.lowerSequence" :variables="variables" :varColors="varColors"
                :symbols="symbols" />
            </div>
          </div>
          <AxiomBar :title="'Bonus-Regeln'" :background="'rgb(187, 231, 247)'"
            :width="derivateBarWidth" :height="derivateBarHeight" :axioms="derivates"
            :variables="variables" :varColors="varColors" :symbols="symbols"
            @selectAxiom="selectAxiom" />
        </div>
      </div>
    </div>
    <Cursor :posX="cursorAxiomX" :posY="cursorAxiomY" :cursorAxiom="cursorAxiom" :symbolWidth="workSymbolWidth"
      :symbols="symbols" :upperHighlights="upperHighlights" :lowerHighlights="lowerHighlights"
      :centerDirectionY="centerDirectionY" :workMatch="workMatch"
      :variables="variables" :varColors="varColors" :varMap="varMap" @axiomDrop="axiomDrop"
      @cursorAxiomClicked="cursorAxiomClicked" @swap="swap" />
    <div v-if="goalMatch" @click="emit('finishLevel')"
      :style="{ position: 'absolute', userSelect: 'none', color: 'red', left: (startX + goalWidth / 2) + 'vw', top: (goalY + goalWidth * 0.8) + 'vw', width: (goalWidth) + 'vw', height: (goalWidth ) + 'vw' }">
      Geschafft!
    </div>
</template>

<script setup lang=ts>
import AxiomBar from './AxiomBar.vue';
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import HeadBar from '@/components/play/HeadBar.vue'
import Cursor from './Cursor.vue';
import { AxiomData, LevelData, SeqVar, SeqSymbol, VarData, SymbolData } from '@/scripts/Interfaces';
import { Ref, ref, defineProps, defineEmits, onMounted, onBeforeUnmount, computed, ComputedRef } from 'vue';
import { axiomHeight, axiomWidth } from '@/scripts/AxiomMethods';

interface Props {
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  axioms: AxiomData[];
  derivates: AxiomData[];
  level: LevelData | null;
  hasNextLevel: boolean;
}
const props = defineProps<Props>();

// Layout variables
const headBarHeight: Ref<number> = ref(3)
const axiomBarWidth: Ref<number> = ref(20);
const axiomBarHeight: Ref<number> = ref(100);
const derivateBarWidth: Ref<number> = ref(100);
const derivateBarHeight: Ref<number> = ref(20);
const workbenchX: Ref<number> = ref(20);
const workbenchY: ComputedRef<number> = computed(() => headBarHeight.value);
const workbenchWidth: Ref<number> = ref(70);
const workbenchHeight: ComputedRef<number> = computed(() => 42);
const workbenchMaxFill: Ref<number> = ref(0.6);
const workbenchMaxSymbolWidthRatio: Ref<number> = ref(0.05);
const startX: Ref<number> = ref(88);
const startY: ComputedRef<number> = computed(() => headBarHeight.value);
const goalY: ComputedRef<number> = computed(() =>
  workbenchHeight.value - goalWidth.value + 0.75);
const goalWidth: Ref<number> = ref(10);
const workSymbolWidth: ComputedRef<number> = computed(() => {
  if (!workSequence.value) {
    return 0;
  }
  const w: number = workbenchMaxFill.value * workbenchWidth.value / workSequence.value.length;
  const maxWidth: number = workbenchMaxSymbolWidthRatio.value * workbenchWidth.value;
  return Math.min(w, maxWidth);
});
const varColors: Ref<string[]> = ref(['red', 'blue', 'green', 'purple', 'orange']);

// Level variables
const goalMatch: ComputedRef<boolean> = computed(() => {
  if (!workSequence.value || workSequence.value?.length !== props.level?.goalAxiom.lowerSequence.length) {
    return false;
  }
  for (let i = 0; i < workSequence.value.length; i++) {
    if (workSequence.value[i] !== props.level?.goalAxiom.lowerSequence[i]) {
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
const workSequence: ComputedRef<SeqSymbol[] | undefined> = computed(() =>
  props.level?.sequenceHistory[props.level.sequenceHistory.length - 1]);
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
  window.addEventListener('touchend', axiomDrop, { passive: false });
});

const emit = defineEmits(['openChapterScreen', 'finishLevel', 'updateSequenceHistory', 'nextLevel']);

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll');
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', updateCursorAxiomPos);
  window.removeEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', axiomDrop);
});

function handleMouseDown(event: MouseEvent) {
  dragging.value = true;
  resetHighlights();
  cursorAxiomDocked.value = false;
  varMap.value.clear();
  updateCursorAxiomPos(event);
}

function handleResize() {
  axiomDrop();
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

function axiomDrop(): void {
  if (!workSymbolWidth.value || cursorAxiom.value.upperSequence.length === 0) {
    return;
  }

  const centerX: number = cursorAxiomX.value + axiomWidth(cursorAxiom.value, workSymbolWidth.value) / 2;
  const centerY: number = cursorAxiomY.value + axiomHeight(workSymbolWidth.value) / 2;

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
    console.log(workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY - workSymbolWidth.value * 0.5 - axiomHeight(workSymbolWidth.value);
    nearSequence = cursorAxiom.value.lowerSequence;
    farSequence = cursorAxiom.value.upperSequence;
    nearHighlights = lowerHighlights;
    centerDirectionY.value = 1;
  } else {
    // Lower half
    axiomOffset = (lowerLength <= upperLength) ? 0 : ((lowerLength - upperLength) * 0.5 * workSymbolWidth.value);
    cursorAxiomY.value = workbenchCenterY + workSymbolWidth.value * 0.5;
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
  if (!props.level || !workSequence.value || !workSequence.value.length || !props.variables) {
    return;
  }

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
    let match = false;
    if (typeof nearSymbol === 'number') {
      match = (workSymbol === nearSymbol);
    } else if ('varIndex' in nearSymbol && 'colorIndex' in nearSymbol) {
      let variable = nearSymbol as SeqVar;
      let varData: VarData = props.variables[variable.varIndex];
      let workSymbolIndex: number = workSymbol as number;
      let key = `${variable.varIndex},${variable.colorIndex}`;
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

function selectAxiom(event: MouseEvent, axiom: AxiomData): void {
  cursorAxiom.value = ({
    upperSequence: [...axiom.upperSequence],
    lowerSequence: [...axiom.lowerSequence]
  });
  handleMouseDown(event);
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
  cursorAxiom.value.upperSequence = [];
  resetHighlights();
  cursorAxiomDocked.value = false;
}

function updateWorkSequence(): void {
  if (!workSequence.value) {
    return;
  }

  let newSequence: SeqSymbol[] = [];

  // Keep all symbols left of the match

  for (let i = 0; i < dockIndex.value; i++) {
    newSequence.push(workSequence.value[i]);
  }

  // Replace the matching part with farSequence

  newSequence.push(...farSequence.map(symbol => {
    if (typeof symbol !== 'number' && 'varIndex' in symbol && 'colorIndex' in symbol) {
      const variable = symbol as SeqVar;
      let key = `${variable.varIndex},${variable.colorIndex}`;
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
.screen-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.goal-window {
  background-color: #ffffff;
  border: 1vw solid rgb(63, 196, 244);
}

.no-scroll {
  overflow: hidden;
  height: 100%;
}
</style>