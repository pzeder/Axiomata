<template>
  <div class="chapter-container">
    <div class="chapter-title-package">
      <div class="chapter-title"> {{ chapter.title }} </div>
      <TextButton v-if="editable" text="Titel ändern" background="yellow" @click="emit('editText')" />
      <TextButton v-if="editable" text="Löschen" @click="emit('deleteChapter')" />
    </div>
    <AxiomList v-if="chapter.newAxioms.length > 0 || editable" :title="''" :axioms="chapter.newAxioms"
      :symbols="course.symbols" :variables="course.variables" :maxWidth=40 :containerWidth=10 :editable="editable"
      @editAxiom="(index) => emit('editAxiom', { target: AxiomEditTarget.CHAPTER, levelPointer: { chapterIndex: chapterIndex, levelIndex: index } })"
      @deleteAxiom="(index) => emit('deleteAxiom', index)" />
    <div class="level-list" v-for="( level, levelIndex ) in  chapter.levels " :key="levelIndex">
      <TextButton text="Neues Level hinzufügen" background="orange" @click="emit('addNewLevel', levelIndex)" />
      <div class="level-package">
        <LevelContainer :course="course" :chapterIndex="chapterIndex" :levelIndex="levelIndex" :level="level"
          :frontLevelPointer="frontLevelPointer" :editable="editable" @openLevel="emit('openLevel', levelIndex)"
          @toggleBonus="emit('toggleBonus', levelIndex)"
          @editAxiom="emit('editAxiom', { target: AxiomEditTarget.LEVEL, levelPointer: { chapterIndex: chapterIndex, levelIndex: levelIndex } })" />
        <TextButton v-if="editable" text="Löschen" @click="emit('deleteLevel', levelIndex)" />
      </div>
    </div>
    <TextButton text="Neues Level hinzufügen" background="orange" @click="emit('addNewLevel', chapter.levels.length)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import AxiomList from '@/components/axiom/AxiomList.vue';
import LevelContainer from './LevelContainer.vue';
import { ChapterData, CourseData, LevelPointer, AxiomEditTarget } from '@/scripts/Interfaces';
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
const emit = defineEmits(['openLevel', 'editText', 'deleteChapter',
  'addNewLevel', 'deleteLevel', 'toggleBonus', 'editAxiom', 'deleteAxiom']);
</script>

<style>
.chapter-container {
  display: grid;
  place-items: center;
  justify-content: center;
  margin-bottom: 2vw;
}

.chapter-title-package {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5vw;
  margin-bottom: 1vw;
}

.chapter-title {
  user-select: none;
  font-size: 5vw;
  flex: 3;
  color: lightblue;
  text-align: center;
}

.level-list {
  display: grid;
  place-items: center;
}

.level-package {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
}
</style>