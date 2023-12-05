<template>
  <div class="delete-button"> {{ text }} </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  text: string;
}

const props = defineProps<Props>();
</script>

<style>
.delete-button {
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 1vw;
  margin-left: 2vw;
  display: grid;
  place-items: center;
  font-size: 10pt;
  user-select: none;
  background: red;
  padding-left: 2vw;
  padding-right: 2vw;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}
</style>