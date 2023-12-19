<template>
  <div class="level-container" @click="handleClick" :style="{ backgroundColor: levelColor }">
    <div class="axiom-placeholder" v-if="editable && !level.goalAxiom">
      <TextButton text="START / ZIEL festlegen" background="white" @click="emit('editAxiom')" />
    </div>
    <AxiomContainer class="goal-axiom" v-if="level.goalAxiom" :width=10 :height=10 :axiom="level.goalAxiom"
      :symbols="course.symbols" :variables="course.variables" :background="levelColor" :borderColor="levelColor"
      @selectAxiom="emit('editAxiom')" />
    <div class="level-title"> Level {{ levelNumber }} </div>
    <div class="edit-bonus-tag" v-if="editable">
      <TextButton :text="bonusTagText" :background="bonusTagColor" @click="emit('toggleBonus')" />
    </div>
    <div class="test-button" v-if="editable">
      <TextButton text="Testen" background="lightgreen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import { CourseData, LevelData, LevelPointer } from '@/scripts/Interfaces';
import TextButton from './TextButton.vue';

interface Props {
  course: CourseData;
  chapterIndex: number;
  levelIndex: number;
  level: LevelData;
  frontLevelPointer: LevelPointer | null;
  editable: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['openLevel', 'toggleBonus', 'editAxiom']);

const levelNumber: ComputedRef<number> = computed(() => {
  return props.course.chapters.slice(0, props.chapterIndex).map(c => c.levels.length).reduce((acc, val) => acc + val, 1) + props.levelIndex;
});

const bonusTagText: ComputedRef<string> = computed(() => props.level.bonus ? 'BONUS' : 'NORMAL');
const bonusTagColor: ComputedRef<string> = computed(() => props.level.bonus ? 'gold' : 'grey');

const isFrontLevel: ComputedRef<boolean> = computed(() => props.frontLevelPointer?.chapterIndex === props.chapterIndex && props.frontLevelPointer?.levelIndex === props.levelIndex);

const levelColor: ComputedRef<string> = computed(() => isFrontLevel.value ? 'orange' : (props.level.bestSolution ? 'lightgreen' : 'rgb(150,150,150)'));

function handleClick(): void {
  if (props.editable) {
    return;
  }
  if (isFrontLevel.value || props.level.bestSolution) {
    emit('openLevel');
  }
}
</script>

<style>
.level-container {
  display: flex;
  place-items: center;
  border: 0.5vw solid black;
  border-radius: 1.5vw;
  margin-top: 0.5vw;
  margin-bottom: 0.5vw;
  user-select: none;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.level-container:hover {
  opacity: 100%;
  transform: scale(1.04);
}

.goal-axiom {
  flex: 1;
  margin-left: 2vw;
}

.axiom-placeholder {
  display: grid;
  place-items: center;
  padding: 1vw;
}

.level-title {
  user-select: none;
  font-size: 3vw;
  flex: 3;
  display: grid;
  place-items: center;
  text-align: center;
  padding-left: 3vw;
  padding-right: 10vw;
  color: rgb(44, 44, 44);
}

.test-button {
  margin-right: 2vw;
}
</style>