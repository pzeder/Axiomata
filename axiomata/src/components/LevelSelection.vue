<template>
  <div class="level-container">
    <button v-for="level in levels" :key="level.id" @click="handleButtonClick(level)"> {{ level }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import axios from 'axios';

interface Props {
  selectedCourse: string;
}

const props = defineProps<Props>();
const selectedCourse: Ref<string> = ref(props.selectedCourse);

interface LevelInstance {
  id: number;
  levelName: string;
}

const levels: Ref<LevelInstance[]> = ref([]);

onMounted(() => {
  fetchLevels();
});

function handleButtonClick(level: LevelInstance) {
  console.log(level);
}

async function fetchLevels(): Promise<void> {
  if (selectedCourse.value === "") {
    return;
  }
  try {
    const response = await axios.get('http://localhost:3000/levels?courseName=' + selectedCourse.value);
    if (response.status === 200) {
      levels.value = [];
      levels.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.level-container {
  display: flex;
  flex-direction: column;
}

.level-container button {
  margin-bottom: 10px;
  /* This adds space between the buttons */
}
</style>