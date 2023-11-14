<template>
  <div class="axiom-container">
    <Axiom :symbolWidth="3" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="symbolAlphabet"
      @mousedown="selectAxiom(axiom)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import Axiom from '@/components/play/Axiom.vue';

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

const emit = defineEmits(['selectAxiom']);

function selectAxiom(axiom: AxiomData): void {
  console.log('child');
  emit('selectAxiom', axiom);
}
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