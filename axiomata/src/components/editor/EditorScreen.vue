<template>
  <div> {{ title }} </div>
  <ChapterList v-if="course" :chapters="course.chapters" @addNewChapter="addNewChapter" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted } from 'vue';
import { CourseData } from '@/scripts/Interfaces';
import ChapterList from '@/components/editor/ChapterList.vue';

interface Props {
  editID: any;
}

const course: Ref<CourseData | null> = ref(null);

const props = defineProps<Props>();

onMounted(() => {
  fetchEdit();
});

async function addNewChapter(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/addNewChapter' + query);
    if (response.status === 200) {
      course.value.chapters = response.data.chapters;
      console.log(course.value.chapters);
      console.log('New chapter successfully:', response.data);
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
</script>