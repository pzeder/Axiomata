<template>
  <div class="box" @mouseleave="handleMouseLeave">
    database: {{ index }}
  </div>
  <div class="container" @wheel.passive="resizeBall">
    <Circle ref="cursor" :initX=0 :initY=0 :radius=80 :color="'rgb(255,0,0)'" :style="{ zIndex: zIndexMax }"></Circle>
    <Circle v-for="circle in circles" :key="circle.id" :initX="circle.xpos" :initY="circle.ypos" :radius="circle.radius"
      :color="circle.color" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';
import Circle from './Circle.vue';
import DB from '@/scripts/DB';
import { CircleInstance, CircleData } from '@/interfaces/CircleIF';
import audioFile from '@/assets/tuba_cut.mp3';

const cursor = ref<CircleInstance | null>(null);
const zIndexMax = ref(9999);
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const circles = ref<CircleData[]>([]);
const index = ref<number>(1);
let id = 0;
let colorIndex = 0;

onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  fetchData();
});

async function fetchData(): Promise<void> {
  try {
    circles.value = [];
    circles.value = await DB.fetchData(index.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function handleMouseMove(event: any) {
  if (cursor.value && typeof cursor.value.setPos === 'function') {
    cursor.value.setPos(event.clientX, event.clientY);
  }
}

function handleMouseLeave() {
  index.value = (++index.value > 3) ? 1 : index.value;
  fetchData();
}

function handleMouseDown(event: MouseEvent): void {
  if (!(event.button === 0) || !cursor.value) {
    return;
  }
  zIndexMax.value++;
  circles.value.push({
    id: id++,
    xpos: cursor.value.getX(),
    ypos: cursor.value.getY(),
    radius: cursor.value.getRadius(),
    color: cursor.value.getColor()
  });
  DB.updateData(index.value, circles.value);
}

function resizeBall(event: WheelEvent): void {
  if (cursor.value) {
    cursor.value.setRadius(event);
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'c') {
    circles.value = [];
    DB.updateData(index.value, circles.value);
  }
  if (event.key === 'Shift') {
    const nextColor: string = colors[++colorIndex % colors.length];
    if (cursor.value) {
      cursor.value.setColor(nextColor);
    }
  }
  if (event.key === 'Backspace') {
    if (cursor.value) {
      circles.value.pop();
      DB.updateData(index.value, circles.value);
    }
  }
  if (event.key === 'n') {
    if (cursor.value) {
      index.value = (++index.value > 3) ? 1 : index.value;
      fetchData();
    }
  }
  if (event.key === 'a') {
    playAudio();
  }
}

const audio = ref(new Audio(audioFile));

function playAudio() {
  audio.value.play();
}
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.box {
  width: 80px;
  height: 20px;
  border: 2px solid black;
  padding: 10px;
  margin: 20px;
  background-color: #f5f5f5;
  text-align: center;
  position: absolute;
}
</style>
