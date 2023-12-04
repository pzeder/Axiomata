<template>
  <div :style="{
    position: 'absolute',
    left: posX + 'vw',
    top: posY + 'vw'
  }">
    <AxiomComp v-if="cursorAxiom.upperSequence.length !== 0" :symbolWidth="symbolWidth" 
      :axiomData="cursorAxiom" :symbols="symbols" :upperHighlights="upperHighlights" :variables="variables"
      :varColors="varColors" :lowerHighlights="lowerHighlights" :varMap="varMap" @mouseup="emit('axiomDrop')"
      @touchend="emit('axiomDrop')" @touchcancel="emit('axiomDrop')" @mousedown="emit('cursorAxiomClicked')"
      @touchstart="emit('cursorAxiomClicked')" />
    <div class="swap-button" v-if="workMatch" @click="emit('swap')" :style="{
      display: 'grid',
      placeItems: 'center',
      position: 'absolute',
      left: ((Math.max(cursorAxiom.upperSequence.length, cursorAxiom.lowerSequence.length) - 1) * symbolWidth / 2) + 'vw',
      top: (centerDirectionY > 0 ? (-symbolWidth * 1.5) : (symbolWidth * 3)) + 'vw',
      width: symbolWidth + 'vw',
      height: (symbolWidth) + 'vw',
    }"> SWAP </div>
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, withDefaults } from 'vue';
import AxiomComp from '@/components/axiom/AxiomComp.vue';

interface Props {
  posX: number;
  posY: number;
  cursorAxiom: AxiomData;
  symbolWidth: number;
  symbols: SymbolData[] | undefined;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
  centerDirectionY: number;
  workMatch: boolean;
  variables: VarData[] | undefined;
  varColors: string[];
  varMap: Map<string, number>;
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<string, number>()
});
const emit = defineEmits(['axiomDrop', 'swap', 'cursorAxiomClicked']);
</script>

<style>
.swap-button {
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background-color: green;
  user-select: none;
}
</style>