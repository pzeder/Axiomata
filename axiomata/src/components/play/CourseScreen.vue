<template>
  <ChapterScreen v-if="showChapterScreen" :chapters="course?.chapters" @openStartMenu="emit('openStartMenu')" @updateChapters="updateChapters"
    @openSaveStateMenu="emit('openSaveStateMenu')" :saveID="saveID" />
  <!--LevelScreen v-if="showLevelScreen" @openLevelMenu="openLevelMenu" @updateSequenceHistory="updateSequenceHistory"
    @levelFinished="updateLevelEnd" @nextLevel="nextLevel" :levelData="currentLevel"
    :hasNextLevel="nextChapterIndex !== -1" /-->
</template>

<script setup lang="ts">
import { ChapterData, CourseData } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted } from 'vue';
import ChapterScreen from './ChapterScreen.vue';
import LevelScreen from './LevelScreen.vue';

interface Props {
    saveID: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['openStartMenu', 'openSaveStateMenu']);

const showChapterScreen: Ref<boolean> = ref(false);
const showLevelScreen: Ref<boolean> = ref(false);

const course: Ref<CourseData | null> = ref(null);

onMounted(() => {
    fetchCourse();
    showChapterScreen.value = true;
});

async function fetchCourse(): Promise<void> {
    try {
    const query: string = '?saveID=' + props.saveID;
    const response = await axios.get('http://localhost:3000/course' + query);
    if (response.status === 200) {
      course.value = response.data;
      console.log(course.value);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }    
}

function openChapterScreen(): void {
  showLevelScreen.value = false;
  showChapterScreen.value = true;
}

function updateChapters(updatedChapters: ChapterData[]): void {
    if (course.value) {
        course.value.chapters = updatedChapters;
    }
}
</script>