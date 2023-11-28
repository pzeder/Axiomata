<template>
  <div> {{ course?.title }} </div>
  <ChapterList v-if="course" :chapters="course.chapters" @addNewChapter="addNewChapter"
    @renameChapter="openRenameWindow" />
  <RenameWindow v-if="showRenameWindow" :chapterIndex="renameChapterIndex" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted } from 'vue';
import { CourseData } from '@/scripts/Interfaces';
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

async function addNewChapter(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/addNewChapter' + query);
    if (response.status === 200) {
      if (course.value) {
        course.value.chapters = response.data.chapters;
        console.log('New chapter  added successfully:', response.data);
      } else {
        console.log('Error while adding new chapter: course.value is null');
      }
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}

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
  console.log('open');
  renameChapterIndex.value = chapterIndex;
  showRenameWindow.value = true;
}
</script>