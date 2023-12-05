<template>
  <div ref="rootElement" class="slider-container">
    <input type="range" min="0" max="255" v-model="sliderValue" class="slider" id="myRange"
      @mousemove="emit('changeValue', sliderValue)" @mouseup="emit('changeValue', sliderValue)">
    <div> {{ sliderValue }} </div>
  </div>
</template>


<script setup lang="ts">
import { Ref, ref, defineEmits, defineProps, onMounted } from 'vue';

interface Props {
  color: string;
  defaultValue: number;
}

const rootElement: Ref<HTMLElement | null> = ref(null);
const props = defineProps<Props>();
const emit = defineEmits(['changeValue']);
const sliderValue = ref(props.defaultValue);

onMounted(() => {
  if (rootElement.value) {
    rootElement.value.style.setProperty('--slider-thumb-color', props.color);
  }
});
</script>

<style scoped>
.slider-container {
  width: 50%;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 25px;
  background: #ffffff;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  cursor: pointer;
  background: var(--slider-thumb-color);
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  cursor: pointer;
  background: var(--slider-thumb-color);
}
</style>

