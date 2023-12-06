<template>
  <div class="edit-chapter">
    <TitleBar :title="chapter.title" :height=5 @editTitle="emit('editChapterTitle')" />
    <EditLevelList :editID="editID" :chapterIndex="chapterIndex" :levels="chapter.levels" :symbols="symbols"
      @updateChapters="(updatedChapters) => emit('updateChapters', updatedChapters)"
      @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" />
    <DeleteButton text="Kapitel löschen" @click="emit('deleteChapter')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from '../TitleBar.vue';
import EditLevelList from './EditLevelList.vue';
import DeleteButton from '../DeleteButton.vue';
import { ChapterData, SymbolData } from '@/scripts/Interfaces';

interface Props {
  editID: any;
  chapterIndex: number;
  chapter: ChapterData;
  symbols: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle', 'deleteChapter', 'updateChapters', 'updateSymbols']);
</script>

<style>
.edit-chapter {
  width: 100vw;
  border: 2px solid black;
  border-radius: 1vw;
  margin-bottom: 10px;
  font-size: 20pt;
  user-select: none;
  background: rgb(89, 204, 245);
}
</style>