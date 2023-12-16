<template>
  <div class="chapter-container">
    <div class="chapter-title"> {{ chapter.title }} </div>
    <AxiomList v-if="chapter.newAxioms.length > 0" :title="''" :axioms="chapter.newAxioms" :symbols="course.symbols"
      :variables="course.variables" :maxWidth=40 :containerWidth=10 />
    <div class="level-list" v-for="(level, levelIndex) in chapter.levels" :key="levelIndex">
      <TextButton v-if="editable" text="Neues Level hinzufügen" background="orange" />
      <div class="level-package">
        <LevelContainer :course="course" :chapterIndex="chapterIndex" :levelIndex="levelIndex" :level="level"
          :frontLevelPointer="frontLevelPointer" @openLevel="emit('openLevel', levelIndex)" />
        <TextButton v-if="editable" text="Löschen" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import AxiomList from '@/components/axiom/AxiomList.vue';
import LevelContainer from './LevelContainer.vue';
import { ChapterData, CourseData, LevelPointer } from '@/scripts/Interfaces';
import TextButton from './TextButton.vue';

interface Props {
  course: CourseData;
  chapterIndex: number;
  chapter: ChapterData;
  frontLevelPointer: LevelPointer | null;
  editable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: () => false
});
const emit = defineEmits(['openLevel']);
</script>

<style>
.chapter-container {
  display: grid;
  place-items: center;
  margin-bottom: 2vw;
}

.chapter-title {
  user-select: none;
  font-size: 5vw;
  flex: 3;
  color: lightblue;
  text-align: center;
  margin-bottom: 1vw;
}

.level-package {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>