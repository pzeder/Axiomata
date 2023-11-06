<template>
  <div class="chapter-container" v-for="chapter in chapters" :key="chapter.id">
    {{ chapter.chapterName }}
    <button v-for="level in chapter.levels" 
      :key="level.id" @click="handleButtonClick(chapter.chapterName, level.levelName)"
      :style="{backgroundColor: (!chapter.unlocked ? 'rgb(150,150,150)' : (level.status === 'todo' ? 'rgb(255,100,100)' : 'rgb(100,255,100)'))}"> 
        {{ level.levelName }} 
    </button>
  </div>
    <button @click="backToCourseMenu"> zurück </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

interface Props {
  selectedCourse: string;
  userName: string;
}

const props = defineProps<Props>();
const selectedCourse: Ref<string> = ref(props.selectedCourse);
const userName: Ref<string> = ref(props.userName);

interface ChapterInstance {
  id: number;
  chapterName: string;
  unlocked: boolean;
  levels: LevelInstance[];
}

interface LevelInstance {
  id: number;
  levelName: string;
  status: string;
}

const chapters: Ref<ChapterInstance[]> = ref([]); 

const emit = defineEmits(['levelSelected', 'backToCourseMenu']);

onMounted(() => {
  fetchLevels();
});

function handleButtonClick(chapterName: string, levelName: string) {
  emit('levelSelected', chapterName, levelName);
}

async function fetchLevels(): Promise<void> {
  if (selectedCourse.value === "") {
    return;
  }
  try {
    const request: string = '?courseName=' + selectedCourse.value + "&userName=" + userName.value;
    const response = await axios.get('http://localhost:3000/chapters' + request);
    if (response.status === 200) {
      chapters.value = [];
      chapters.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function backToCourseMenu(): void {
  emit('backToCourseMenu');
}
</script>

<style>
.chapter-container {
  display: flex;
  flex-direction: column;
  font-size: 30px;
}

.chapter-container button {
  margin-bottom: 10px;
}
</style>