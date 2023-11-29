<template>
  <div class="rename-window">
    <div class="rn-headbar"> Titel des Kapitels ändern </div>
    <div :style="{ display: 'flex' }">
      <input id="input-bar" type="text" v-model="textInput" :placeholder="chapterTitle" @keyup.enter="updateName">
      <div class="ok-button" @click="updateName"> ok </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChapterData } from '@/scripts/Interfaces';
import axios from 'axios';
import { defineProps, Ref, ref, defineEmits } from 'vue';

interface Props {
  editID: any;
  chapterIndex: number;
  chapterTitle: string | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateChapters', 'closeRenameWindow']);

const textInput: Ref<string> = ref('');

async function updateName(): Promise<void> {
  if (textInput.value.length === 0) {
    emit('closeRenameWindow');
    return;
  }
  try {
    const updateData = {
      editID: props.editID,
      chapterIndex: props.chapterIndex,
      newChapterTitle: textInput.value
    };
    const response = await axios.patch('http://localhost:3000/chapterTitle', updateData);
    if (response.status === 200) {
      const updatedChapters: ChapterData[] = response.data.chapters;
      emit('updateChapters', updatedChapters);
      emit('closeRenameWindow');
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.rename-window {
  position: absolute;
  left: 35vw;
  top: 35vh;
  width: 30vw;
  height: 15vh;
  background-color: orange;
}

.rn-headbar {
  width: 100%;
  height: 30%;
  background-color: rgb(215, 140, 0);
  text-align: center;
  font-size: 4vh;
  user-select: none;
}

#input-bar {
  width: 50%;
  height: 20%;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ok-button {
  width: 10%;
  height: 20%;
  margin: 2vw;
  background-color: green;
  border: 1px solid black;
  border-radius: 4px;
  text-align: center;
  color: black;
  user-select: none;
}
</style>