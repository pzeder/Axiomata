<template>
  <div class="text-button" :style="{ background: background }"> {{ text }} </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  text: string;
  background: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: () => '',
  background: () => 'red'
});
</script>

<style>
.text-button {
  display: grid;
  place-items: center;
  font-size: 1vw;
  padding: 1vw;
  border: 0.3vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  user-select: none;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.text-button:hover {
  opacity: 100%;
  transform: scale(1.1);
}
</style>