<template>
  <div class="backdrop-text" />
  <div class="screen-container-text" @click="emit('close')">
    <div class="text-input-window" @click.stop="() => { }">
      <div class="text-input-title"> {{ title }} </div>
      <input id="input-bar" type="text" maxLength=100 v-model="textInput" :placeholder="placeholder"
        @keyup.enter="confirm" autocomplete="off">
      <div class="ok-button-container">
        <TextButton text="OK" background="lightgreen" @click="confirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref, defineEmits } from 'vue';
import TextButton from './TextButton.vue';

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
.screen-container-text {
  position: fixed;
  display: grid;
  place-items: center;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
}

.backdrop-text {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: black;
  opacity: 60%;
  z-index: 350;
}

.text-input-window {
  background-color: lightblue;
  border: 0.5vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  z-index: 400;
  display: grid;
  place-items: center;
}

.text-input-title {
  font-size: 2vw;
  text-align: center;
  padding: 1vw;
  color: rgb(44, 44, 44);
}

#input-bar {
  width: 20vw;
  height: 2vw;
  padding: 0.3vw;
  border: 0.1vw solid #ccc;
  border-radius: 0.5vw;
  font-size: 1vw;
}

.ok-button-container {
  padding: 1vw;
}
</style>