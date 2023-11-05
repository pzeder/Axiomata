<template>
  <div class="chapter-container" v-for="chapter in chapters" :key="chapter.id">
    {{ chapter.chapterName }}
    <button v-for="level in chapter.levelNames" :key="level.id" @click="handleButtonClick(level)"> {{ level }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps } from 'vue';
import axios from 'axios';

interface Props {
  selectedCourse: string;
}

const props = defineProps<Props>();
const selectedCourse: Ref<string> = ref(props.selectedCourse);

interface ChapterInstance {
  id: number;
  chapterName: string;
  levelNames: string[];
}

const chapters: Ref<ChapterInstance[]> = ref([]);

onMounted(() => {
  fetchLevels();
});

function handleButtonClick(levelName: string) {
  console.log(levelName);
}

async function fetchLevels(): Promise<void> {
  if (selectedCourse.value === "") {
    return;
  }
  try {
    const response = await axios.get('http://localhost:3000/levels?courseName=' + selectedCourse.value);
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
</script>

<style>
.chapter-container {
  display: flex;
  flex-direction: column;
  font-size: 30px;
}

.chapter-container button {
  margin-bottom: 10px;
  /* This adds space between the buttons */
}
</style>