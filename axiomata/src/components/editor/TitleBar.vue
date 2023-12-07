<template>
  <div class="title-bar">
    <div class="tag" :style="{ fontSize: (height * 0.8) + 'vh' }"> {{ tag }}: </div>
    <div :style="{ fontSize: height + 'vh' }"> {{ title }}</div>
    <TextEditButton @click="emit('editTitle')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TextEditButton from './TextEditButton.vue';

interface Props {
  tag: string;
  title: string | undefined;
  height: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editTitle'])
</script>

<style>
.title-bar {
  display: flex;
  place-items: center;
  margin-left: 2vw;
}

.tag {
  color: rgb(103, 103, 103);
  margin-right: 1vw;
  margin-top: 0.1vw;
}
</style>