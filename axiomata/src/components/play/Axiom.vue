<template>
  <div class="container" :style="{
    width: (symbolWidth) + 'vw',
    height: (3 * symbolHeight) + 'vh',
  }" >
  {{ axiomData.name }} </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';
import { AxiomData } from '@/scripts/Interfaces';

interface Props {
  symbolWidth: number;
  symbolHeight: number;
  axiomData: AxiomData;
}
const props = defineProps<Props>();
</script>

<style>
.container {
  position: absolute;
  background-color: rgb(50, 116, 60);
}
</style>