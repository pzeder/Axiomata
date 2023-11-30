<template>
  <TitleBar :title="course?.title" :height=10 @editTitle="editCourseTitle" />
  <EditChapterList v-if="course" :editID="editID" :chapters="course.chapters" @updateChapters="updateChapters"
    @editChapterTitle="editChapterTitle" />
  <TextInput v-if="showTextInput" :placeholder="textInputPlaceholder" :target="textInputTarget"
    @updateText="updateText" />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted, ComputedRef, computed } from 'vue';
import { CourseData, ChapterData } from '@/scripts/Interfaces';
import EditChapterList from '@/components/editor/EditChapterList.vue';
import TextInput from '@/components/editor/TextInput.vue';
import TitleBar from './TitleBar.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();

const course: Ref<CourseData | null> = ref(null);
const chapterIndex: Ref<number> = ref(-1);
const showTextInput: Ref<boolean> = ref(false);
const textInputTarget: Ref<string> = ref('');
const textInputPlaceholder: ComputedRef<string | undefined> = computed(() => {
  switch (textInputTarget.value) {
    case 'course':
      return course.value?.title;
    case 'chapter':
      return course.value?.chapters[chapterIndex.value].title;
    default:
      return '';
  }
});

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

async function updateText(text: string): Promise<void> {
  showTextInput.value = false;
  if (text.length === 0) {
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      text: text,
      target: textInputTarget.value,
      chapterIndex: chapterIndex.value,
    };
    const response = await axios.patch('http://localhost:3000/text', updateData);
    if (response.status === 200) {
      const updatedCourse: CourseData = response.data.course;
      course.value = updatedCourse;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function editCourseTitle(): void {
  textInputTarget.value = 'course';
  showTextInput.value = true;
}

function editChapterTitle(index: number): void {
  textInputTarget.value = 'chapter';
  chapterIndex.value = index;
  showTextInput.value = true;
}

function updateChapters(updatedChapters: ChapterData[]) {
  if (course.value) {
    course.value.chapters = updatedChapters;
  }
}
</script>