<template>
  <div class="chapter-container">
    <div class="chapter-title-package">
      <div class="chapter-title"> {{ chapter.title }} </div>
      <TextButton v-if="editable" text="Titel ändern" background="yellow" @click="emit('editText')"/>
      <TextButton v-if="editable" text="Löschen"/>
    </div>
    <AxiomList v-if="chapter.newAxioms.length > 0" :title="''" :axioms="chapter.newAxioms" :symbols="course.symbols"
      :variables="course.variables" :maxWidth=40 :containerWidth=10 :editable="editable"/>
    <div v-for="(level, levelIndex) in chapter.levels" :key="levelIndex">
      <div class="new-level-button">
        <TextButton v-if="editable" text="Neues Level hinzufügen" background="orange" />
      </div>
      <div class="level-package">
        <LevelContainer :course="course" :chapterIndex="chapterIndex" :levelIndex="levelIndex" :level="level"
          :frontLevelPointer="frontLevelPointer" @openLevel="emit('openLevel', levelIndex)" />
        <TextButton v-if="editable" text="Löschen" />
      </div>
    </div>
    <div class="new-level-button" :style="{ marginLeft: -11.1 + 'vw'}">
      <TextButton v-if="editable" text="Neues Level hinzufügen" background="orange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import AxiomList from '@/components/axiom/AxiomList.vue';
import LevelContainer from './LevelContainer.vue';
import { ChapterData, CourseData, LevelPointer, TextEditTarget } from '@/scripts/Interfaces';
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
const emit = defineEmits(['openLevel', 'editText']);
</script>

<style>
.chapter-container {
  display: grid;
  place-items: center;
  margin-bottom: 2vw;
}

.chapter-title-package {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chapter-title {
  user-select: none;
  font-size: 5vw;
  flex: 3;
  color: lightblue;
  text-align: center;
  margin-bottom: 1vw;
}

.new-level-button {
  width: 20vw;
  margin-left: 8.5vw;
}

.level-package {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>