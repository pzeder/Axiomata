<template>
  <div class="sequence-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <Sequence :symbolWidth="symbolWidth" :screenRatio="screenRatio" :sequence="sequence" :symbolAlphabet="symbolAlphabet"
      :highlights="highlights" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { SymbolData } from '@/scripts/Interfaces';
import Sequence from '@/components/axiom/Sequence.vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  maxFill: number;
  maxSymbolWidthRatio: number;
  screenRatio: number;
  sequence: number[];
  symbolAlphabet: SymbolData[];
  highlights: boolean[];
}

const props = withDefaults(defineProps<Props>(), {
  highlights: () => []
});

const symbolWidth = computed(() => {
  const w: number = props.maxFill * props.width / props.sequence.length;
  const maxWidth: number = props.maxSymbolWidthRatio * props.width;
  return Math.min(w, maxWidth);
});
</script>

<style>
.sequence-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
</style>