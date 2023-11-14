<template>
  <div class="axiom-bar" :style="{ top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <div class="axiom-container" v-for="(axiom, key) in axioms" :key="key">
      <Axiom :symbolWidth="3" :screenRatio="screenRatio" :axiomData="axiom" :symbolAlphabet="symbolAlphabet"
        @mousedown="selectAxiom(axiom)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import { defineEmits, defineProps } from 'vue';
import Axiom from '@/components/play/Axiom.vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  screenRatio: number;
  axioms: AxiomData[];
  symbolAlphabet: SymbolData[];
}
const props = defineProps<Props>();

const emit = defineEmits(['selectAxiom']);

function selectAxiom(axiom: AxiomData): void {
  emit('selectAxiom', axiom);
}
</script>

<style>
.axiom-bar {
  display: grid;
  place-items: center;
  position: absolute;
  left: 0;
  background: rgb(252, 223, 203);
  color: #fff;
}

.axiom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;
}
</style>