<template>
  <div class="rename-window">
    <div class="rn-headbar"> Titel des {{ chapterIndex }}. Kapitels ändern </div>
    <div :style="{ display: 'flex' }">
      <input type="text" id="textInput" placeholder="Enter text here">
      <div class="ok-button"> ok </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  chapterIndex: number;
}

const props = defineProps<Props>();
</script>

<style>
.rename-window {
  position: absolute;
  left: 35vw;
  top: 35vh;
  width: 30vw;
  height: 15vh;
  background-color: orange;
}

.rn-headbar {
  width: 100%;
  height: 30%;
  background-color: rgb(215, 140, 0);
  text-align: center;
  font-size: 4vh;
  user-select: none;
}

#textInput {
  width: 50%;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ok-button {
  width: 10%;
  height: 20%;
  margin: 2vw;
  background-color: green;
  border: 1px solid black;
  border-radius: 4px;
  text-align: center;
  color: black;
  user-select: none;
}
</style>