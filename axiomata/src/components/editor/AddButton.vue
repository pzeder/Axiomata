<template>
  <div class="add-button-container">
    <div class="add-new-button" :style="{ background: color }"> {{ text }} </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed, defineProps } from 'vue';

interface Props {
  target: string;
}

const props = defineProps<Props>();
const text: ComputedRef<string> = computed(() => {
  switch (props.target) {
    case 'chapter':
      return "Neues Kapitel hinzufügen";
    case 'level':
      return "Neues Level hinzufügen";
    default:
      return "ERROR: faulty target";
  }
});
const color: ComputedRef<string> = computed(() => {
  switch (props.target) {
    case 'chapter':
      return 'rgb(89, 204, 245)';
    case 'level':
      return 'rgb(255, 157, 0)';
    default:
      return "ERROR: faulty target";
  }
});
</script>

<style>
.add-button-container {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 9vh;
}

.add-new-button {
  width: 20vw;
  height: 5vh;
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10pt;
  user-select: none;
  background: rgb(104, 206, 104);
}
</style>