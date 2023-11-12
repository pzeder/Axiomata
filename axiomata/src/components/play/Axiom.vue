<template>
  <div class="container" :style="{
    width: (maxSequence * symbolWidth) + 'vw',
    height: (2.5 * symbolHeight) + 'vh',
  }" >
  <div class="connection" :style="{ 
    left: (maxSequence * symbolWidth / 2 - symbolWidth / 4) + 'vw',   
    width: (symbolWidth / 2) + 'vw'
    }"/>
  <Sequence :symbolWidth="symbolWidth" :symbolIndices="axiomData.upperSequence" :symbolAlphabet="symbolAlphabet" :style="{
    left: (symbolWidth * (maxSequence - axiomData.upperSequence.length) / 2) + 'vw',
    top: 0
    }"/>
  <Sequence :symbolWidth="symbolWidth" :symbolIndices="axiomData.lowerSequence" :symbolAlphabet="symbolAlphabet" :style="{
    left: (symbolWidth * (maxSequence - axiomData.lowerSequence.length) / 2) + 'vw',
    top: (1.5 * symbolHeight) + 'vh'
    }"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import Sequence from '@/components/play/Sequence.vue';

interface Props {
  symbolWidth: number;
  axiomData: AxiomData;
  symbolAlphabet: SymbolData[];
}
const props = defineProps<Props>();

const maxSequence: number = Math.max(props.axiomData.upperSequence.length, props.axiomData.lowerSequence.length);
const symbolHeight: number = props.symbolWidth * window.innerWidth / window.innerHeight;
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