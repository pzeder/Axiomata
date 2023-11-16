<template>
  <div class="start-container">
    <button @click="openNewCourseMenu"> Neues Spiel </button>
    <button @click="openSaveStateMenu"> Laden </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, defineEmits, ref } from 'vue';

const emit = defineEmits(['openNewCourseMenu', 'openSaveStateMenu']);

const screenWidth: Ref<number> = ref(window.innerWidth);
const screenHeight: Ref<number> = ref(window.innerHeight);

function openNewCourseMenu(): void {
  emit('openNewCourseMenu');
}

function openSaveStateMenu(): void {
  emit('openSaveStateMenu');
}
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