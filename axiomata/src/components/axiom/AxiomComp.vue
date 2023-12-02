<template>
  <div class="container" :style="{
    width: (maxSequence * symbolWidth) + 'vw',
    height: (2.5 * symbolHeight) + 'vh',
  }">
    <div class="connection" :style="{
      left: (maxSequence * symbolWidth / 2 - symbolWidth / 4) + 'vw',
      width: (symbolWidth / 2) + 'vw'
    }" />
    <SequenceComp :symbolWidth="symbolWidth" :screenRatio="screenRatio" :sequence="axiomData.upperSequence"
      :variables="variables" :varColors="varColors" :varMap="varMap" :symbols="symbols"
      :highlights="upperHighlights" :style="{
        left: (symbolWidth * (maxSequence - axiomData.upperSequence.length) / 2) + 'vw',
        top: 0
      }" />
    <SequenceComp :symbolWidth="symbolWidth" :screenRatio="screenRatio" :sequence="axiomData.lowerSequence"
      :variables="variables" :varColors="varColors" :varMap="varMap" :symbols="symbols"
      :highlights="lowerHighlights" :style="{
        left: (symbolWidth * (maxSequence - axiomData.lowerSequence.length) / 2) + 'vw',
        top: (1.5 * symbolHeight) + 'vh'
      }" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  symbolWidth: number;
  screenRatio: number;
  axiomData: AxiomData;
  symbols: SymbolData[] | undefined;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
  variables: VarData[] | undefined;
  varColors: string[];
  varMap: Map<string, number>;
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<string, number>()
});

const maxSequence = computed(() => Math.max(props.axiomData.upperSequence.length, props.axiomData.lowerSequence.length));
const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);
</script>

<style>
.container {
  position: absolute;
  background-color: none;
}

.connection {
  position: absolute;
  top: 10%;
  height: 80%;
  background-color: rgb(160, 160, 160);
}
</style>