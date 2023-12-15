<template>
  <div class="text-button"> {{ text }} </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();
</script>

<style>
.text-button {
  display: grid;
  place-items: center;
  font-size: 1vw;
  padding: 1vw;
  background: red;
  border: 0.3vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  user-select: none;
  margin-left: 1.5vw;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.text-button:hover {
  opacity: 100%;
  transform: scale(1.1);
}
</style>