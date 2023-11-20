<template>
  <div class="axiom-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <Axiom :symbolWidth="symbolWidth" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="symbolAlphabet"
      @mousedown="selectAxiom(axiom)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import Axiom from '@/components/axiom/Axiom.vue';
import { maxSequenceLength } from '@/scripts/AxiomMethods';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  screenRatio: number;
  axiom: AxiomData;
  symbolAlphabet: SymbolData[];
}
const props = defineProps<Props>();

const emit = defineEmits(['selectAxiom', 'mouseOver']);

function selectAxiom(axiom: AxiomData): void {
  emit('selectAxiom', axiom);
}

const symbolWidth = computed(() => {
  const w: number = 0.8 * props.width / maxSequenceLength(props.axiom);
  const maxWidth: number = 0.15 * props.width;
  return Math.min(w, maxWidth);
});
</script>

<style>
.axiom-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;
}
</style>