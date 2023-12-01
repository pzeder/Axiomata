<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div class="edit-symbol" :style="{ background: backgroundColor, color: textColor }">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const backgroundColor: Ref<string> = ref('red');
const text: Ref<string> = ref('text');
const textColor: Ref<string> = ref('blue');
</script>

<style>
.edit-symbol-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 20%;
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