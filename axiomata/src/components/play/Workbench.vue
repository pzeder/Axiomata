<template>
  <div class="workbench" :style="{
    left: posX + 'vw',
    top: posY + 'vh',
    width: width + 'vw',
    height: height + 'vh'
  }">
    <Sequence :symbolWidth="symbolWidth" :screenRatio="screenRatio" :symbolIndices="sequence" :highlights="workHighlights"
      :symbolAlphabet="symbolAlphabet" :style="{
        position: 'absolute',
        left: ((width - sequence.length * symbolWidth) / 2) + 'vw',
        top: ((height - symbolWidth * screenRatio) / 2) + 'vh'
      }" />
  </div>
</template>

<script setup lang="ts">
import { SymbolData } from '@/scripts/Interfaces';
import { defineProps, Ref, ref } from 'vue';
import Sequence from '../axiom/Sequence.vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  symbolWidth: number;
  screenRatio: number;
  workHighlights: boolean[];
  sequence: number[];
  symbolAlphabet: SymbolData[];
}

const props = defineProps<Props>();

const mouseOverWorkbench: Ref<boolean> = ref(false);
</script>

<style>
.workbench {
  position: absolute;
}
</style>