<template>
  <div class="axiom-bar" :style="{ top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :posX="posX" :posY="posY + index * (width * screenRatio)" :width="width"
      :height="containerHeight" :screenRatio="screenRatio" :axiom="axiom" :symbolAlphabet="symbolAlphabet"
      @selectAxiom="selectAxiom" />
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import { computed, defineProps, defineEmits } from 'vue';
import AxiomContainer from '@/components/play/AxiomContainer.vue'

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
  console.log('parent');
  emit('selectAxiom', axiom);
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