<template>
  <ChapterScreen v-if="showChapterScreen" :chapters="course?.chapters" :currentLevelPointer="currentLevelPointer"
    @openSaveStateMenu="emit('openSaveStateMenu')" @openLevel="openLevel" />
  <LevelScreen :symbols="course?.symbols" :variables="course?.variables" :axioms="currentAxioms" :derivates="currentDerivates" :level="currentLevel" :hasNextLevel="hasNextLevel" v-if="showLevelScreen"  />
</template>

<script setup lang="ts">
import { AxiomData, ChapterData, CourseData, LevelData, LevelPointer } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef } from 'vue';
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

const currentLevelPointer: ComputedRef<LevelPointer | null> = computed(() => {
  if (!course.value || !course.value.chapters) {
    return null;
  }
  for (let ch = 0; ch < course.value.chapters.length; ch++) {
    let chapter: ChapterData = course.value.chapters[ch];
    for (let lvl = 0; lvl < chapter.levels.length; lvl++) {
      let level: LevelData = chapter.levels[lvl];
      if (!level.solved) {
        return {
        chapterIndex: ch,
        levelIndex: lvl
        };
      }
    }
  }
  return null;
});

const currentLevel: ComputedRef<LevelData | null> = computed(() => {
    if (!currentLevelPointer.value || !course.value) {
        return null;
    }
    let chapterIndex = currentLevelPointer.value.chapterIndex;
    let levelIndex = currentLevelPointer.value.levelIndex;
    return course.value.chapters[chapterIndex].levels[levelIndex];
});

const currentAxioms: ComputedRef<AxiomData[]> = computed(() => []); // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const currentDerivates: ComputedRef<AxiomData[]> = computed(() => []); // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const hasNextLevel: ComputedRef<boolean> = computed(() => true); // TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }    
}

function openLevel(): void {
    showChapterScreen.value = false;
    showLevelScreen.value = true;
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