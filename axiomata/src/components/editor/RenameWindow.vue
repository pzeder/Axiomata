<template>
  <div class="rename-window">
    <div class="rn-headbar"> Titel des Kapitels ändern </div>
    <div :style="{ display: 'flex' }">
      <input class="input-bar" type="text" v-model="textInput" :placeholder="chapterTitle">
      <div class="ok-button" @click="updateName"> ok </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';

interface Props {
  chapterTitle: string | undefined;
}

const props = defineProps<Props>();

const textInput: Ref<string> = ref('');

async function updateName(): Promise<void> {
  console.log(textInput.value);
}
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

.input-bar {
  width: 50%;
  height: 20%;
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