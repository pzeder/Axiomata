<template>
  <div class="container">
    <SequenceComp class="infront" :symbolWidth="symbolWidth" :sequence="axiomData.upperSequence"
      :variables="variables" :varColors="varColors" :varMap="varMap" :symbols="symbols"
      :highlights="upperHighlights" :style="{
        marginBottom: (axiomHeight(symbolWidth) - 2 * symbolWidth) + 'vw',
      }" />
    <SequenceComp class="infront" :symbolWidth="symbolWidth" :sequence="axiomData.lowerSequence"
      :variables="variables" :varColors="varColors" :varMap="varMap" :symbols="symbols"
      :highlights="lowerHighlights" />
    <div class="connection" :style="{
      width: (symbolWidth * 0.5) + 'vw',
      height: (symbolWidth * 1.5) + 'vw'
      }" /> 
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import { axiomHeight } from '@/scripts/AxiomMethods';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  symbolWidth: number;
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
</script>

<style>
.container {
  background-color: none;
  display: grid;
  place-items: center;
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
  background-color: rgb(160, 160, 160);
}
</style>