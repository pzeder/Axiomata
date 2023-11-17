<template>
  <div class="axiom-container"
    :style="{ left: posX, top: posY + index * (width * screenRatio), width: width, height: height }">
    <Axiom :symbolWidth="symbolWidth" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="symbolAlphabet"
      @mousedown="selectAxiom(axiom)" @mouseenter="mouseOver" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import Axiom from '@/components/axiom/Axiom.vue';
import { maxSequenceLength } from '@/scripts/AxiomMethods';

interface Props {
  index: number;
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

function mouseOver(): void {
  emit('mouseOver', props.index);
}

const symbolWidth = computed(() => {
  const w: number = props.width * 0.8 / maxSequenceLength(props.axiom);
  const maxWidth: number = props.height * 0.15 / props.screenRatio;
  return Math.min(w, maxWidth);
});
</script>

<style>
.axiom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;
}
</style>