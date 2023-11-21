<template>
  <div class="chapter-container" v-for="(chapter, chIndex) in chapters" :key="chIndex">
    {{ chapter.chapterName }}
    <button v-for="(level, lvlIndex) in chapter.levelHeaders" :key="lvlIndex"
      @click="trySelectingLevel(chapter.unlocked, chIndex, lvlIndex)"
      :style="{ backgroundColor: (!chapter.unlocked ? 'rgb(150,150,150)' : (level.status === 'todo' ? '#F53227' : (level.status === 'busy' ? '#F5AA27' : '#3FB56E'))) }">
      {{ level.levelName }}
    </button>
  </div>
  <button :style="{fontSize: 20 + 'pt'}" @click="openSaveStateMenu"> Ladebidschirm </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

interface Props {
  saveID: any;
}

const props = defineProps<Props>();
const saveID: Ref<any> = ref(props.saveID);

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
  fetchChapterHeaders();
});

const emit = defineEmits(['selectLevel', 'openSaveStateMenu', 'openStartMenu']);

function trySelectingLevel(unlocked: boolean, chapterIndex: number, levelIndex: number) {
  if (unlocked) {
    emit('selectLevel', chapterIndex, levelIndex);
  }
}

function openSaveStateMenu(): void {
  emit('openSaveStateMenu');
}

function openStartMenu() {
  emit('openStartMenu');
}

async function fetchChapterHeaders(): Promise<void> {
  try {
    const query: string = '?saveID=' + saveID.value;
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
  font-size: 50pt;
}

.chapter-container button {
  margin-bottom: 10px;
  font-size: 30pt;
}
</style>