<template>
  <div class="backdrop" />
  <div class="screen-container" @click="emit('close')">
    <div class="text-input-window" @click.stop="() => { }">
      <div class="ti-headbar"> {{ title }} </div>
      <div :style="{ display: 'flex' }">
        <input id="input-bar" type="text" maxLength=100 v-model="textInput" :placeholder="placeholder"
          @keyup.enter="confirm">
        <div class="ok-button" @click="confirm"> ok </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref, defineEmits } from 'vue';

interface Props {
  title: string;
  placeholder: string | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateText', 'close']);

const textInput: Ref<string> = ref('');

function confirm(): void {
  emit('updateText', textInput.value);
  emit('close')
}
</script>

<style>
.screen-container {
  position: fixed;
  display: grid;
  place-items: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 300;
}

.backdrop {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: black;
  opacity: 60%;
  z-index: 200;
}

.text-input-window {
  position: absolute;
  width: 30vw;
  height: 15vh;
  background-color: orange;
}

.ti-headbar {
  width: 100%;
  height: 30%;
  background-color: rgb(215, 140, 0);
  text-align: center;
  font-size: 4vh;
  user-select: none;
}

#input-bar {
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