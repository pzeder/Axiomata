<template>
  <div class="color-editor">
    <div class="color-editor-title"> {{ title }} </div>
    <ValueSlider :maxValue=255 :defaultValue="editColor.red" color="red" @changeValue="setRed" />
    <ValueSlider :maxValue=255 :defaultValue="editColor.green" color='green' @changeValue="setGreen" />
    <ValueSlider :maxValue=255 :defaultValue="editColor.blue" color='blue' @changeValue="setBlue" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, defineEmits, defineProps } from 'vue';
import ValueSlider from '../UI/ValueSlider.vue';
import { ColorValue } from '@/scripts/Interfaces';

interface Props {
  title: string;
  color: ColorValue;
}

const props = defineProps<Props>();

const emit = defineEmits(['changeColor']);

const editColor: Ref<ColorValue> = ref(props.color);

function setRed(value: number) {
  editColor.value.red = value;
  emit('changeColor', editColor.value);
}

function setGreen(value: number) {
  editColor.value.green = value;
  emit('changeColor', editColor.value);
}

function setBlue(value: number) {
  editColor.value.blue = value;
  emit('changeColor', editColor.value);
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