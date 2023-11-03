<template>
  <div :style="{
    top: (0.75 * radius) + 'px',
    left: (0.75 * radius) + 'px',
    width: (radius / 2) + 'px',
    height: (radius / 2) + 'px',
    backgroundColor: 'white',
    position: 'absolute',
    animation: currentAnimation
  }" @animationend="animationFinished">
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, defineProps, computed, ComputedRef, onMounted } from 'vue';

interface Props {
  radius: number;
}

const props = defineProps<Props>();

enum Animation {
  IDLE, MOVE
}

const animationState: Ref<Animation> = ref(Animation.IDLE);

const currentAnimation: ComputedRef<string> = computed(() => {
  switch (animationState.value) {
    case Animation.MOVE:
      return 'move-square 3660ms';
    default:
      return 'none';
  }
});

onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
});

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'a') {
    console.log(animationState.value)
    animationState.value = Animation.MOVE;
  }
}

function animationFinished(event: AnimationEvent) {
  if (event.target === event.currentTarget) {
    animationState.value = Animation.IDLE;
  }
}
</script>

<style>
@keyframes move-square {
  0% {
    animation-timing-function: ease-in;
  }

  12% {
    transform: translate(100%, 0) rotate(90deg);
    animation-timing-function: ease-out;
  }

  58% {
    transform: translate(100%, 100%) rotate(180deg);
    animation-timing-function: ease-in;
  }

  70% {
    transform: translate(0, 100%) rotate(270deg);
    animation-timing-function: linear;
  }

  73.4% {
    transform: translate(-10px, 84%) rotate(285deg);
    animation-timing-function: linear;
  }

  78.3% {
    transform: translate(10px, 68%) rotate(300deg);
    animation-timing-function: linear;
  }

  82.2% {
    transform: translate(-10px, 52%) rotate(315deg);
    animation-timing-function: linear;
  }

  85.9% {
    transform: translate(10px, 36%) rotate(330deg);
    animation-timing-function: linear;
  }

  91% {
    transform: translate(-10px, 10%) rotate(345deg);
    animation-timing-function: cubic-bezier(0, 0, 0.74, 1.38);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}
</style>