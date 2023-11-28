<template>
  <div> {{ course?.title }} </div>
  <ChapterList v-if="course" :editID="editID" :chapters="course.chapters" @updateChapters="updateChapters"
    @renameChapter="openRenameWindow" />
  <RenameWindow v-if="showRenameWindow" :chapterTitle="course?.chapters[renameChapterIndex].title" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted } from 'vue';
import { CourseData, ChapterData } from '@/scripts/Interfaces';
import ChapterList from '@/components/editor/ChapterList.vue';
import RenameWindow from '@/components/editor/RenameWindow.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();

const course: Ref<CourseData | null> = ref(null);
const renameChapterIndex: Ref<number> = ref(-1);
const showRenameWindow: Ref<boolean> = ref(false);

onMounted(() => {
  fetchEdit();
});

async function fetchEdit(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/edit' + query);
    if (response.status === 200) {
      course.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function openRenameWindow(chapterIndex: number): void {
  renameChapterIndex.value = chapterIndex;
  showRenameWindow.value = true;
}

function updateChapters(updatedChapters: ChapterData[]) {
  if (course.value) {
    course.value.chapters = updatedChapters;
  }
}
</script>