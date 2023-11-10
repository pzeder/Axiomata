<template>
  <div class="container"> {{ axiomData.name }} </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';
import { AxiomData } from '@/scripts/Interfaces';
interface Props {
  axiomData: AxiomData;
}
const props = defineProps<Props>();
const axiomData: Ref<AxiomData> = ref(props.axiomData);
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  background-color: red;
}
</style>