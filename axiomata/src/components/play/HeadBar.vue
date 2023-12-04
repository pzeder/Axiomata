<template>
  <div class="headbar" :style="{ height: height + 'vw'}">
    <button :style="{ position: 'relative', width: 5 + 'vw' }" @click="emit('openLevelMenu')"> Zurück </button>
    <div :style="{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 + '%' }">
      <div :style="{ color: 'white' }"> {{ levelTitle }} </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  levelTitle: string | undefined;
  height: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['openLevelMenu']);
</script>

<style>
.headbar {
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  background: rgb(89, 204, 245);
}
</style>