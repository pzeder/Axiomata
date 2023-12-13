<template>
  <div class="axiom">
    <SequenceComp class="infront" :symbolWidth="symbolWidth" :sequence="axiomData.upperSequence" :variables="variables"
      :varMap="varMap" :symbols="symbols" :highlights="upperHighlights" :style="{
        marginBottom: (axiomHeight(symbolWidth) - 2 * symbolWidth) + 'vw',
      }" />
    <SequenceComp class="infront" :symbolWidth="symbolWidth" :sequence="axiomData.lowerSequence" :variables="variables"
      :varMap="varMap" :symbols="symbols" :highlights="lowerHighlights" />
    <div class="connection" :style="{
      width: (symbolWidth * 0.5) + 'vw',
      height: (axiomHeight(symbolWidth) * 0.8) + 'vw'
    }" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';
import { AxiomData, SymbolData, SymbolPointer } from '@/scripts/Interfaces';
import { axiomHeight } from '@/scripts/AxiomMethods';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  symbolWidth: number;
  axiomData: AxiomData;
  symbols: SymbolData[] | undefined;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<number, SymbolPointer>()
});
</script>

<style>
.axiom {
  background-color: none;
  display: grid;
  place-items: center;
  position: relative;
}

.infront {
  z-index: 1;
}

.connection {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 0;
  background: linear-gradient(to right, rgb(44, 44, 44), darkgray);
}
</style>