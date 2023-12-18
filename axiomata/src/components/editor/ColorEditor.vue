<template>
  <div class="color-editor">
    <div class="color-editor-title"> {{ title }} </div>
    <ValueSlider :maxValue=255 :defaultValue="defaultValue" color="red" @changeValue="setRed" />
    <ValueSlider :maxValue=255 :defaultValue="defaultValue" color='green' @changeValue="setGreen" />
    <ValueSlider :maxValue=255 :defaultValue="defaultValue" color='blue' @changeValue="setBlue" />
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, ref, defineEmits, defineProps } from 'vue';
import ValueSlider from '../UI/ValueSlider.vue';

interface Props {
  title: string;
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
  background-color: none;
  display: grid;
  place-items: center;
}

.color-editor-title {
  margin-bottom: 2vw;
}
</style>