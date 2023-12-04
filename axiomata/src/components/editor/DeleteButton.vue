<template>
  <div class="delete-button"> {{ text }} </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();
</script>

<style>
.delete-button {
  width: 10vw;
  height: 5vh;
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 1vw;
  margin-left: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10pt;
  user-select: none;
  background: red;
}
</style>