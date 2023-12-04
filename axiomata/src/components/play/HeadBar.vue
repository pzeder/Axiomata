<template>
  <div class="level-headbar" :style="{ height: height + 'vw', color: 'white' }">
    <div class="back-button" @click="emit('openLevelMenu')"> Zurück </div>
    <div class="head-title"> {{ levelTitle }} </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  levelTitle: string | undefined;
  height: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['openLevelMenu']);
</script>

<style>
.level-headbar {
  display: flex;
  width: 100%;
  background: rgb(89, 204, 245);
}

.back-button {
  flex-shrink: 0;
  flex-basis: 5%;
  width: 5%;
  height: 100%;
  border: 0.2vw solid black;
  border-radius: 1vw;
  box-sizing: border-box;
  display: grid;
  place-content: center;
  background: orange;
  font-size: 1vw;
  color: white;
}

.head-title {
  width: 75%;
  height: 100%;
  font-size: 1.5vw;
  color: white;
  display: grid;
  place-items: center;
}
</style>