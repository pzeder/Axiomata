<template>
  <div class="color-editor">
    <ColorSlider :defaultValue="defaultValue" color="red" @changeValue="setRed" />
    <ColorSlider :defaultValue="defaultValue" color='green' @changeValue="setGreen" />
    <ColorSlider :defaultValue="defaultValue" color='blue' @changeValue="setBlue" />
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, defineEmits, defineProps } from 'vue';
import ColorSlider from '@/components/editor/ColorSlider.vue';

interface Props {
  defaultValue: number;
}

const props = defineProps<Props>();

const emit = defineEmits(['changeColor']);

const red: Ref<number> = ref(props.defaultValue);
const green: Ref<number> = ref(props.defaultValue);
const blue: Ref<number> = ref(props.defaultValue);

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