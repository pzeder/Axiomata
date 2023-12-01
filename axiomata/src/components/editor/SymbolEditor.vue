<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div>
      <div class="title-container">
        <div class="edit-symbol-title"> Neues Symbol erstellen </div>
      </div>
      <div class="flex-container">
        <ColorEditor title="Hintergrundfarbe" :defaultValue=255 @changeColor="setBackgroundColor" />
        <div class="edit-symbol" :style="{ background: backgroundColor, color: textColor }">
          {{ text }}
        </div>
        <ColorEditor title="Textfarbe" :defaultValue=0 @changeColor="setTextColor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import ColorEditor from './ColorEditor.vue';

const backgroundColor: Ref<string> = ref('white');
const text: Ref<string> = ref('text');
const textColor: Ref<string> = ref('black');

function setBackgroundColor(color: string) {
  backgroundColor.value = color;
}

function setTextColor(color: string) {
  textColor.value = color;
}
</script>

<style>
.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 20%;
}

.edit-symbol-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.title-container {
  display: grid;
  place-items: center;
}

.edit-symbol-title {
  margin-bottom: 0;
  font-size: 5vh;
  background: orange;
  width: 30vw;
  display: grid;
  place-items: center;
  border-radius: 2vw;
}

.flex-container {
  display: flex;
  justify-content: center;
  background-color: rgb(192, 191, 191);
  border-radius: 20vw;
}

.edit-symbol {
  width: 20vw;
  height: 20vw;
  border: 1vw solid black;
  border-radius: 5vw;
  display: grid;
  place-items: center;
  font-size: 10vh;
}
</style>
