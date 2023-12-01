<template>
  <div class="color-editor">
    <ColorSlider color="red" @changeValue="setRed" />
    <ColorSlider color='green' @changeValue="setGreen" />
    <ColorSlider color='blue' @changeValue="setBlue" />
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, defineEmits } from 'vue';
import ColorSlider from '@/components/editor/ColorSlider.vue';

const emit = defineEmits(['changeColor']);

const red: Ref<number> = ref(255);
const green: Ref<number> = ref(255);
const blue: Ref<number> = ref(255);

const rgb: ComputedRef<string> = computed(() =>
  'rgb(' + red.value + ',' + green.value + ',' + blue.value + ')');

function setRed(value: number) {
  red.value = value;
  emit('changeColor', rgb.value);
}

function setGreen(value: number) {
  green.value = value;
  emit('changeColor', rgb.value);
}

function setBlue(value: number) {
  blue.value = value;
  emit('changeColor', rgb.value);
}
</script>

<style>
.color-editor {
  width: 30vw;
  height: 20vw;
  background-color: white;
  display: grid;
  place-items: center;
}
</style>