<template>
  <div class="edit-chapter">
    <TitleBar :tag="chapterTag" :title="chapter.title" :height=5 @editTitle="emit('editChapterTitle')" />
    <div :style="{ display: 'flex' }">
      <AxiomList title="Neue Tauschregeln in diesem Kapitel" :axioms="chapter.newAxioms" :symbols="symbols" :maxWidth="60"
        :containerWidth="20" @editNewAxiom="emit('editNewAxiom')" @deleteAxiom="(index) => emit('deleteAxiom', index)" />
    </div>
    <EditLevelList :chapterIndex="chapterIndex" :levels="chapter.levels" :symbols="symbols" />
    <DeleteButton text="Kapitel löschen" @click="emit('deleteChapter')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import TitleBar from '../TitleBar.vue';
import EditLevelList from './EditLevelList.vue';
import DeleteButton from '../DeleteButton.vue';
import AxiomList from './AxiomList.vue';
import { ChapterData, SymbolData } from '@/scripts/Interfaces';

interface Props {
  chapterIndex: number;
  chapter: ChapterData;
  symbols: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['editChapterTitle', 'deleteChapter', 'editNewAxiom', 'deleteAxiom']);

const chapterTag: ComputedRef<string> = computed(() => 'Kapitel ' + (props.chapterIndex + 1));
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