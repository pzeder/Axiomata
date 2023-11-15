<template>
  <div class="victory" :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh' }"> Level
    geschafft!
    <button @click="emit('openLevelMenu')"> zurück zur Levelauswahl </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
}
const props = defineProps<Props>();

const emit = defineEmits(['openLevelMenu']);
</script>

<style>
.victory {
  background-color: rgb(255, 157, 0);
  position: absolute;
  font-size: 80pt;
  color: white;
}
</style>