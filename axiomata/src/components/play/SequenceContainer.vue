<template>
  <div class="sequence-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vw' }">
    <Sequence :symbolWidth="4" :screenRatio="screenRatio" :symbolIndices="symbolIndices"
      :symbolAlphabet="symbolAlphabet" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
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
</script>

<style>
.sequence-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  background-color: #333;
  color: #fff;
}
</style>