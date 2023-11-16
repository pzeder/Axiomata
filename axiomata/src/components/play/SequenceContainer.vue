<template>
  <div class="sequence-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vw' }">
    <Sequence :symbolWidth="symbolWidth" :screenRatio="screenRatio" :symbolIndices="symbolIndices"
      :symbolAlphabet="symbolAlphabet" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { SymbolData } from '@/scripts/Interfaces';
import Sequence from '@/components/play/Sequence.vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  screenRatio: number;
  symbolIndices: number[];
  symbolAlphabet: SymbolData[];
}

const props = defineProps<Props>();
const symbolWidth = computed(() => {
  const w: number = 0.8 * props.width / props.symbolIndices.length;
  const maxWidth: number = 0.33 * props.width;
  return Math.min(w, maxWidth);
});
</script>

<style>
.sequence-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: #ffffff;
  border: 1vw solid rgb(63, 196, 244);
  ;
}
</style>