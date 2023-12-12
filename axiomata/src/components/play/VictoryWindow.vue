<template>
  <div class="screen-container">
    <div class="victory-container">
      <div class="victory-text"> Level geschafft! </div>
      <div class="victory-button-container"> 
        <div class="victory-button" @click="emit('openLevelMenu')"> Zurück zum Menü </div>
        <div v-if="hasNextLevel" class="victory-button" @click="emit('nextLevel')"> Nächstes Level </div> 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  hasNextLevel: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['openLevelMenu', 'nextLevel']);
</script>

<style>
.screen-container {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}

.victory-container {
  background-color: rgb(255, 157, 0);
  border: 2vw solid black;
  border-radius: 5vw;
  display: grid;
  place-items: center;
}

.victory-text {
  font-size: 10vw;
  text-align: center;
  background-color: none;
  color: white;
  padding: 5vw;
}

.victory-button-container {
  display: flex;
  margin-bottom: 3vw;
}

.victory-button {
  font-size: 4vw;
  text-align: center;
  background-color: white;
  color: black;
  border: 1vw solid black;
  border-radius: 3vw;
  padding: 2vw;
  margin: 2vw;
  user-select: none;
}
</style>