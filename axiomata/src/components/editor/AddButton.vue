<template>
  <div class="add-button-container">
    <div class="add-new-button"> {{ text }} </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();
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
}
</style>