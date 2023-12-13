<template>
  <div class="backdrop"></div>
  <div class="screen-container">
    <div class="note-container">
      <div v-html="sanatizedText" />
      <div class="note-ok-button-container">
        <div class="note-ok-button" @click="emit('close')"> OK </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import DOMPurify from 'dompurify';

interface Props {
  text: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const sanatizedText: ComputedRef<string> = computed(() => DOMPurify.sanitize(props.text));
</script>

<style>
.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 60%;
  z-index: 200;
}

.screen-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  z-index: 201;
}

.note-container {
  display: grid;
  font-size: 2vw;
  color: black;
  background: orange;
  border: 0.5vw solid black;
  border-radius: 0.5vw;
  width: 30vw;
  padding: 2vw;
  text-align: center;
}

.note-ok-button-container {
  display: grid;
  place-items: center;
}

.note-ok-button {
  display: grid;
  place-items: center;
  padding: 1vw;
  border: 0.2vw solid black;
  border-radius: 0.5vw;
  margin-top: 2vw;
  background: rgb(0, 206, 0);
  user-select: none;
}
</style>