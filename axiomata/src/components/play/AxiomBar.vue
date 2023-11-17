<template>
  <div class="axiom-bar" :style="{ top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :index="index" :posX="posX" :posY="posY" :width="width"
      :height="containerHeight" :screenRatio="screenRatio" :axiom="axiom" :symbolAlphabet="symbolAlphabet"
      @selectAxiom="selectAxiom" @mouseOver="mouseOver" />
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import { computed, defineProps, defineEmits } from 'vue';
import AxiomContainer from '@/components/axiom/AxiomContainer.vue'

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  screenRatio: number;
  axioms: AxiomData[];
  symbolAlphabet: SymbolData[];
  isInserting: boolean;
  insertionIndex: number;
}
const props = defineProps<Props>();

const emit = defineEmits(['selectAxiom', 'mouseOver']);

function selectAxiom(axiom: AxiomData): void {
  emit('selectAxiom', axiom);
}

function mouseOver(index: number) {
  emit('mouseOver', index);
}

const containerHeight = computed(() => props.width * props.screenRatio);
</script>

<style>
.axiom-bar {
  position: absolute;
  left: 0;
  background: rgb(252, 223, 203);
  color: #fff;
}
</style>