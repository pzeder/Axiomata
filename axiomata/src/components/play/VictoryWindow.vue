<template>
  <div class="victory-container"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh', borderRadius: (width * 0.03) + 'vw' }">
    <div class="victory-text"
      :style="{ left: 0, top: (height * 0.3) + 'vh', width: width + 'vw', height: height + 'vh', fontSize: (width * 0.1) + 'vw' }">
      Level
      geschafft! </div>
    <button class="back"
      :style="{ left: (width * 0.15) + 'vw', top: (height * 0.65) + 'vh', width: (width * 0.3) + 'vw', fontSize: (width * 0.03) + 'vw' }"
      @click="emit('openLevelMenu')"> Zurück zum Menü </button>
    <button v-if="hasNextLevel" class="back"
      :style="{ left: (width * 0.55) + 'vw', top: (height * 0.65) + 'vh', width: (width * 0.3) + 'vw', fontSize: (width * 0.03) + 'vw' }"
      @click="emit('nextLevel')"> Nächstes Level </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  hasNextLevel: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['openLevelMenu', 'nextLevel']);
</script>

<style>
.victory-container {
  background-color: rgb(255, 157, 0);
  position: absolute;
}

.victory-text {
  position: absolute;
  font-size: 80pt;
  text-align: center;
  background-color: none;
  color: white;
}

.back {
  position: absolute;
  font-size: 40pt;
  background-color: white;
}
</style>