<template>
  <div class="level-headbar" :style="{ height: height + 'vw', color: 'white' }">
    <div class="back-button" @click="emit('openLevelMenu')"> Zurück </div>
    <div class="title-package">
      <div class="bonus-level-tag" v-if="bonusLevel"> BONUSLEVEL </div>
      <div class="head-title"> {{ levelTitle }}  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  levelTitle: string | undefined;
  bonusLevel: boolean | undefined;
  height: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['openLevelMenu']);
</script>

<style>
.level-headbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: rgb(89, 204, 245);
  z-index: 200;
}

.back-button {
  flex-shrink: 0;
  flex-basis: 5%;
  height: 100%;
  border: 0.2vw solid black;
  border-radius: 1vw;
  box-sizing: border-box;
  display: grid;
  place-content: center;
  background: orange;
  font-size: 1vw;
  color: white;
  user-select: none;
  padding: 1vw;
  z-index: 201;
}

.title-package {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin-left: -20%;
}

.head-title {
  font-size: 1.5vw;
  color: white;
  display: grid;
  place-items: center;
}

.bonus-level-tag {
  font-size: 2vw;
  color: gold;
  display: grid;
  place-items: center;
  margin-right: 2vw;
}
</style>