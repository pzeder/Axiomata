<template>
  <CourseSelection v-if="showCourseSelection" />
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import CourseSelection from './components/CourseSelection.vue';

const showCourseSelection: Ref<boolean> = ref(true);

onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
});

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'c') {
    showCourseSelection.value = !showCourseSelection.value;
  }
}
</script>
