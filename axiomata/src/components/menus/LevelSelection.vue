<template>
  <div class="sidebar-left">
    <HomeButton @click="emit('openHomeScreen')" />
  </div>
  <CourseContainer :course="course" :frontLevelPointer="frontLevelPointer" :editable="editable"
    @openLevel="(chapterIndex, levelIndex) => emit('openLevel', chapterIndex, levelIndex)"
    @editText="(pointer) => emit('editText', pointer)"
    @addNewChapter="(index) => emit('addNewChapter', index)"
    @deleteChapter="(index) => emit('deleteChapter', index)"
    @addNewLevel="(chapterIndex, levelIndex) => emit('addNewLevel', chapterIndex, levelIndex)"
    @deleteLevel="(chapterIndex, levelIndex) => emit('deleteLevel', chapterIndex, levelIndex)"
    @toggleBonus="(chapterIndex, levelIndex) => emit('toggleBonus', chapterIndex, levelIndex)"
    @editAxiom="(pointer) => emit('editAxiom', pointer)" />
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import { CourseData, LevelPointer } from '@/scripts/Interfaces';
import HomeButton from '../menus/HomeButton.vue';
import CourseContainer from '../UI/CourseContainer.vue';

interface Props {
  course: CourseData;
  frontLevelPointer: LevelPointer | null;
  editable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: () => false
});
const emit = defineEmits(['openLevel', 'openHomeScreen', 'editText', 'addNewChapter', 'deleteChapter', 
  'addNewLevel', 'deleteLevel', 'toggleBonus', 'editAxiom']);
</script>

<style>
.sidebar-left {
  position: fixed;
  left: 2vw;
  top: 2vw;
  display: grid;
  place-items: left;
}

.chapter-list {
  width: 100vw;
  display: grid;
}
</style>