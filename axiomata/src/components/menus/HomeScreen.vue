<template>
  <div class="start-container">
    <button @click="emit('openNewCourseMenu')"> Neues Spiel </button>
    <button @click="emit('openSaveStateMenu')"> Laden </button>
    <button @click="emit('openEditSelection')"> Editor </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, defineEmits, ref } from 'vue';

const emit = defineEmits(['openNewCourseMenu', 'openSaveStateMenu', 'openEditSelection']);

const screenWidth: Ref<number> = ref(window.innerWidth);
const screenHeight: Ref<number> = ref(window.innerHeight);
</script>

<style>
.start-container {
  display: flex;
  flex-direction: column;
  margin-top: 30vh;
}

.start-container button {
  margin-bottom: 10vw;
  font-size: 50pt;
  color: black;
}
</style>