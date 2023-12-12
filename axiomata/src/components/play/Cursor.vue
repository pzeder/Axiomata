<template>
  <div class="cursor-container" :style="{ left: posX + 'vw', top: posY + 'vw' }">
    <AxiomComp :symbolWidth="symbolWidth" :axiomData="cursorAxiom"
      :symbols="symbols" :upperHighlights="upperHighlights" :variables="variables" :lowerHighlights="lowerHighlights"
      :varMap="varMap" @mouseup="emit('axiomDrop')" @touchend="emit('axiomDrop')" @touchcancel="emit('axiomDrop')"
      @mousedown="emit('cursorAxiomClicked')" @touchstart="emit('cursorAxiomClicked')" />
    <div class="swap-button" v-if="workMatch" @click="emit('swap')" :style="{
      left: swapButtonX + 'vw',
      top: swapButtonY + 'vw',
      width: symbolWidth + 'vw',
      height: (symbolWidth) + 'vw',
      fontSize: (symbolWidth * 0.2) + 'vw'
    }"> TAUSCH </div>
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData, SymbolPointer } from '@/scripts/Interfaces';
import { defineProps, defineEmits, withDefaults, ComputedRef, computed } from 'vue';
import AxiomComp from '@/components/axiom/AxiomComp.vue';
import { axiomHeight, maxSequenceLength } from '@/scripts/AxiomMethods';

interface Props {
  posX: number;
  posY: number;
  cursorAxiom: AxiomData;
  symbolWidth: number;
  symbols: SymbolData[] | undefined;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
  aboveCenter: boolean;
  workMatch: boolean;
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<number, SymbolPointer>()
});
const emit = defineEmits(['axiomDrop', 'swap', 'cursorAxiomClicked']);

const swapButtonX: ComputedRef<number> = computed(() => (maxSequenceLength(props.cursorAxiom) - 1) * props.symbolWidth / 2);
const swapButtonY: ComputedRef<number> = computed(() => props.aboveCenter ? -props.symbolWidth * 1.2 : axiomHeight(props.symbolWidth) + props.symbolWidth * 0.2);
</script>

<style>
.cursor-container {
  position: absolute;
  z-index: 500;
}

.swap-button {
  display: grid;
  place-items: center;
  position: absolute;
  border-radius: 50%;
  background-color: orange;
  color: white;
  user-select: none;
}
</style>