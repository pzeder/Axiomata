<template>
  <div class="ball" :style="{
    top: y - radius + 'px',
    left: x - radius + 'px',
    width: (2 * radius) + 'px',
    height: (2 * radius) + 'px',
    backgroundColor: color,
    borderRadius: '50%',
    position: 'absolute',
    animation: currentAnimation
  }" @animationend="animationFinished">
    <Square :radius=radius></Square>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, defineExpose, defineProps, onMounted, computed, ComputedRef } from 'vue';
import Square from './Square.vue';

interface Props {
  initX: number;
  initY: number;
  radius: number;
  color: string;
}

const props = defineProps<Props>();

const x: Ref<number> = ref(props.initX);
const y: Ref<number> = ref(props.initY);
const radius: Ref<number> = ref(props.radius);
const color: Ref<string> = ref(props.color);

enum Animation {
  IDLE, MOVE
}

const animationState: Ref<Animation> = ref(Animation.IDLE);

const currentAnimation: ComputedRef<string> = computed(() => {
  switch (animationState.value) {
    case Animation.MOVE:
      return 'move-circle 3660ms';
    default:
      return 'none';
  }
});

onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
});

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'a') {
    animationState.value = Animation.MOVE;
  }
}

function animationFinished(event: AnimationEvent) {
  if (event.target === event.currentTarget) {
    animationState.value = Animation.IDLE;
  }
}

function setPos(newX: number, newY: number): void {
  x.value = newX;
  y.value = newY;
}

function setRadius(event: any): void {
  if (event.deltaY < 0) {
    radius.value += 5;
  } else {
    radius.value = radius.value > 5 ? radius.value - 5 : 5;
  }
}

function setColor(c: string): void {
  color.value = c;
}

function getX(): number {
  return x.value;
}

function getY(): number {
  return y.value;
}

function getRadius(): number {
  return radius.value;
}

function getColor(): string {
  return color.value;
}

defineExpose({
  setPos, setRadius, setColor, getX, getY, getRadius, getColor
})
</script>

<style>
@keyframes move-circle {
  0% {
    animation-timing-function: ease-in;
  }

  12% {
    transform: translate(60px, 0px);
    animation-timing-function: linear;
  }

  15.6% {
    transform: translate(70px, 7.5px);
    animation-timing-function: linear;
  }

  20.2% {
    transform: translate(50px, 15px);
    animation-timing-function: linear;
  }

  24.3% {
    transform: translate(70px, 22.5px);
    animation-timing-function: linear;
  }

  28.6% {
    transform: translate(50px, 30px);
    animation-timing-function: linear;
  }

  34.1% {
    transform: translate(70px, 37.5px);
    animation-timing-function: linear;
  }

  44% {
    transform: translate(50px, 45px);
    animation-timing-function: linear;
  }

  49.3% {
    transform: translate(70px, 52.5px);
    animation-timing-function: linear;
  }

  58% {
    transform: translate(60px, 60px);
    animation-timing-function: linear;
  }

  70% {
    transform: translate(0, 60px);
    animation-timing-function: cubic-bezier(0.29, -0.56, 0.43, 1.59);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>