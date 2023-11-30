<template>
  <div :style="{ display: 'flex' }">
    <div :style="{ fontSize: height + 'vh' }"> {{ title }}</div>
    <TextEditButton @click="emit('editTitle')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TextEditButton from './TextEditButton.vue';

interface Props {
  title: string | undefined;
  height: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editTitle'])
</script>