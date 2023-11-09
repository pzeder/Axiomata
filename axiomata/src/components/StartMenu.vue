<template>
  <div class="start-container">
    <button @click="openNewCourseMenu"> Neues Spiel </button>
    <button @click="openSaveStateMenu"> Laden </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['openNewCourseMenu', 'openSaveStateMenu']);

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
}

.start-container button {
  margin-bottom: 10px;
}
</style>