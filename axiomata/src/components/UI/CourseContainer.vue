<template>
  <div class="course-container">
    <div class="course-title-package">
      <div class="course-title"> {{ course.title }} </div>
      <TextButton v-if="editable" text="Titel ändern" background="yellow"
        @click="emit('editText', { target: TextEditTarget.COURSE, index: -1 })" />
    </div>
    <transition-group name="chapter-list" tag="div">
      <div v-for="(chapter, chapterIndex) in course.chapters" :key="chapter.title">
        <div class="new-chapter-button">
          <TextButton v-if="editable" text="Neues Kapitel hinzufügen" background="lightblue"
            @click="emit('addNewChapter', chapterIndex)" />
        </div>
        <ChapterContainer :course="course" :chapterIndex="chapterIndex" :chapter="chapter"
          :frontLevelPointer="frontLevelPointer" :editable="editable"
          @openLevel="(levelIndex) => emit('openLevel', chapterIndex, levelIndex)"
          @editText="emit('editText', { target: TextEditTarget.CHAPTER, index: chapterIndex })"
          @deleteChapter="emit('deleteChapter', chapterIndex)"
          @addNewLevel="(levelIndex) => emit('addNewLevel', chapterIndex, levelIndex)"
          @deleteLevel="(levelIndex) => emit('deleteLevel', chapterIndex, levelIndex)"
          @toggleBonus="(levelIndex) => emit('toggleBonus', chapterIndex, levelIndex)"
          @editAxiom="(pointer) => emit('editAxiom', pointer)"
          @deleteAxiom="(index) => emit('deleteAxiom', chapterIndex, index)" />
      </div>
    </transition-group>
    <div class="new-chapter-button">
      <TextButton v-if="editable" text="Neues Kapitel hinzufügen" background="lightblue"
        :style="{ width: 16.5 + 'vw', marginLeft: -8.5 + 'vw' }" @click="emit('addNewChapter', course.chapters.length)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import ChapterContainer from '../UI/ChapterContainer.vue';
import { CourseData, LevelPointer, TextEditTarget } from '@/scripts/Interfaces';
import TextButton from './TextButton.vue';

interface Props {
  course: CourseData;
  frontLevelPointer: LevelPointer | null;
  editable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: () => false
});
const emit = defineEmits(['editText', 'openLevel', 'addNewChapter', 'deleteChapter', 'addNewLevel', 'deleteLevel',
  'toggleBonus', 'editAxiom', 'deleteAxiom']);
</script>

<style>
.course-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vw;
  margin-bottom: 10vw;
}

.new-chapter-button {
  width: 20vw;
  margin-left: 8.5vw;
}

.course-title-package {
  display: flex;
  justify-content: center;
  align-items: center;
}

.course-title {
  display: grid;
  place-items: center;
  font-size: 9vw;
  color: rgb(44, 44, 44);
  user-select: none;
}
</style>