<template>
  <div class="chapter-container" v-for="chapter in chapters" :key="chapter.chapterName">
    {{ chapter.chapterName }}
    <button v-for="level in chapter.levelHeaders" :key="level.levelName"
      @click="levelSelected(chapter.chapterName, level.levelName)"
      :style="{ backgroundColor: (!chapter.unlocked ? 'rgb(150,150,150)' : (level.status === 'todo' ? 'rgb(255,100,100)' : 'rgb(100,255,100)')) }">
      {{ level.levelName }}
    </button>
  </div>
  <button @click="openSaveStateMenu"> zurück </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { UserState } from '@/scripts/Interfaces';

interface Props {
  userState: UserState;
}

const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

interface ChapterHeader {
    chapterName: string;
    unlocked: boolean;
    levelHeaders: LevelHeader[];
}

interface LevelHeader {
  levelName: string;
  status: string;
}

const chapters: Ref<ChapterHeader[]> = ref([]);

onMounted(() => {
  fetchChapters();
});

const emit = defineEmits(['levelSelected', 'openSaveStateMenu']);

function levelSelected(chapterName: string, levelName: string) {
  emit('levelSelected', chapterName, levelName);
}

function openSaveStateMenu(): void {
  emit('openSaveStateMenu');
}

async function fetchChapters(): Promise<void> {
  try {
    const query: string = '?saveID=' + userState.value.saveID;
    const response = await axios.get('http://localhost:3000/chapterHeaders' + query);
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
}
</style>