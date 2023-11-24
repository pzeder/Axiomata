<template>
  <div :style="{
    position: 'absolute',
    left: posX + 'vw',
    top: posY + 'vh'
  }">
    <AxiomComp v-if="cursorAxiom.upperSequence.length !== 0" :symbolWidth="symbolWidth" :screenRatio="screenRatio"
      :axiomData="cursorAxiom" :symbolAlphabet="symbolAlphabet" :upperHighlights="upperHighlights" :variables="variables"
      :varColors="varColors" :lowerHighlights="lowerHighlights" :varMap="varMap" @mouseup="emit('axiomDrop')"
      @mousedown="emit('cursorAxiomClicked')" />
    <div class="swap-button" v-if="workMatch" @click="emit('swap')" :style="{
      display: 'grid',
      placeItems: 'center',
      position: 'absolute',
      left: ((Math.max(cursorAxiom.upperSequence.length, cursorAxiom.lowerSequence.length) - 1) * symbolWidth / 2) + 'vw',
      top: (centerDirectionY > 0 ? (-symbolWidth * screenRatio * 1.5) : (symbolWidth * screenRatio * 3)) + 'vh',
      width: symbolWidth + 'vw',
      height: (symbolWidth * screenRatio) + 'vh',
    }"> SWAP </div>
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import { defineProps, defineEmits } from 'vue';
import AxiomComp from '@/components/axiom/AxiomComp.vue';

interface Props {
  posX: number;
  posY: number;
  cursorAxiom: AxiomData;
  symbolWidth: number;
  symbolAlphabet: SymbolData[];
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
  centerDirectionY: number;
  screenRatio: number;
  workMatch: boolean;
  variables: VarData[];
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
}
</style>