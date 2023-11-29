<template>
  <div :style="{ display: 'flex' }">
    <div> {{ title }}</div>
    <TextEditButton @click="editTitle" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from 'vue';
import TextEditButton from './TextEditButton.vue';

interface Props {
  title: string | undefined;
  target: string;
  chapterIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
  chapterIndex: () => -1
});
const emit = defineEmits(['editCourseTitle', 'editChapterTitle'])

function editTitle(): void {
  switch (props.target) {
    case 'course':
      emit('editCourseTitle');
      break;
    case 'chapter':
      emit('editChapterTitle', props.chapterIndex);
  }
}
</script>