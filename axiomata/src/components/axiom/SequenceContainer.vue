<template>
  <div class="sequence-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <SequenceComp :symbolWidth="symbolWidth" :screenRatio="screenRatio" :sequence="sequence"
      :symbolAlphabet="symbolAlphabet" :highlights="highlights" :variables="variables" :varColors="varColors"
      :varMap="varMap" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { SeqSymbol, SymbolData, VarData } from '@/scripts/Interfaces';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  maxFill: number;
  maxSymbolWidthRatio: number;
  screenRatio: number;
  sequence: SeqSymbol[];
  symbolAlphabet: SymbolData[];
  highlights: boolean[];
  variables: VarData[];
  varColors: string[];
  varMap: Map<string, number>;
}

const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  varMap: () => new Map<string, number>()
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