<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div class="flex-container">
      <div class="slider-collection">
        <ColorSlider color="red" @changeValue="setBackgroundRed" />
        <ColorSlider color='green' @changeValue="setBackgroundGreen" />
        <ColorSlider color='blue' @changeValue="setBackgroundBlue" />
      </div>
      <div class="edit-symbol" :style="{ background: backgroundColor, color: textColor }">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref } from 'vue';
import ColorSlider from '@/components/editor/ColorSlider.vue';

const backgroundColor: ComputedRef<string> = computed(() =>
  'rgb(' + backGroundRed.value + ',' + backGroundGreen.value + ',' + backGroundBlue.value + ')');
const text: Ref<string> = ref('text');
const textColor: Ref<string> = ref('blue');

const backGroundRed: Ref<number> = ref(255);
const backGroundGreen: Ref<number> = ref(255);
const backGroundBlue: Ref<number> = ref(255);

function setBackgroundRed(value: number): void {
  backGroundRed.value = value;
}

function setBackgroundGreen(value: number): void {
  backGroundGreen.value = value;
}

function setBackgroundBlue(value: number): void {
  backGroundBlue.value = value;
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

.flex-container {
  display: flex;
  justify-content: center;
}

.slider-collection {
  width: 30vw;
  height: 20vw;
  background-color: white;
  display: grid;
  place-items: center;
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
