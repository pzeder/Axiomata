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
  width: 50px;
  height: 50px;
  background-color: red;
}
</style>