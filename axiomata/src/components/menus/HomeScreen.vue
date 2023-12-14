<template>
  <div class="screen-container">
    <div class="menu-button-container">
      <div class="menu-button" @click="emit('openNewCourseMenu')" :style="{ background: 'rgb(255,255,150)'}"> Neues Spiel </div>
      <div class="menu-button" @click="emit('openSaveStateMenu')" :style="{ background: 'rgb(255,150,255)'}"> Laden </div>
      <div class="menu-button" @click="emit('openEditSelection')" :style="{ background: 'rgb(150,255,255)'}"> Editor </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, defineEmits, ref } from 'vue';

const emit = defineEmits(['openNewCourseMenu', 'openSaveStateMenu', 'openEditSelection']);

const screenWidth: Ref<number> = ref(window.innerWidth);
const screenHeight: Ref<number> = ref(window.innerHeight);
</script>

<style>
.screen-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.menu-button-container {
  display: grid;
  place-items: center;
}

.menu-button {
  font-size: 4vw;
  color: rgb(44,44,44);
  border: 0.5vw solid rgb(44,44,44);
  border-radius: 1vw;
  padding: 2vw;
  width: 30vw;
  display: grid;
  place-items: center;
  user-select: none;
  margin-bottom: 3vw;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.menu-button:hover {
  opacity: 100%;
  transform: scale(1.04); 
}
</style>