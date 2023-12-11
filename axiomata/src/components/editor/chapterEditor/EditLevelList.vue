<template>
  <div v-for="(level, index) in levels" :key="index">
    <AddButton target="level" @click="emit('addNewLevel', index)" />
    <EditLevel :chapterIndex="chapterIndex" :levelIndex="index" :level="level" :symbols="symbols"
      @editLevelTitle="editLevelTitle(index)" @deleteLevel="emit('deleteLevel', index)"
      @editGoalAxiom="editGoalAxiom(index)" />
  </div>
  <AddButton target="level" @click="emit('addNewLevel', levels.length)" />
  <AxiomEditor v-if="showAxiomEditor" :axiom="editLevel?.goalAxiom" :symbols="symbols" :variables="variables"
    upTitle="START" lowTitle="ZIEL" @close="showAxiomEditor = false" @addSymbol="(symbol) => emit('addSymbol', symbol)"
    @deleteSymbol="(symbol) => emit('deleteSymbol', symbol)" @saveAxiom="setGoalAxiom"
    @toggleVarTarget="(symbol) => emit('toggleVarTarget', symbol)" />
  <TextInput v-if="showTextInput" title="Titel des Levels ändern" :placeholder="editLevel?.title"
    @updateText="setLevelTitle" @close="showTextInput = false" />
</template>

<script setup lang="ts">
import { AxiomData, LevelData, SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import AddButton from '@/components/editor/AddButton.vue'
import EditLevel from './EditLevel.vue'
import AxiomEditor from '../axiomEditor/AxiomEditor.vue';
import TextInput from '../TextInput.vue';

interface Props {
  chapterIndex: number;
  levels: LevelData[];
  symbols: SymbolData[];
  variables: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['addNewLevel', 'deleteLevel', 'setLevelTitle', 'addSymbol',
  'deleteSymbol', 'setGoalAxiom', 'toggleVarTarget']);

const showAxiomEditor: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const editLevelIndex: Ref<number> = ref(-1);
const editLevel: ComputedRef<LevelData | null> = computed(() => {
  if (editLevelIndex.value === -1) {
    return null;
  }
  return props.levels[editLevelIndex.value];
});

function editLevelTitle(levelIndex: number) {
  editLevelIndex.value = levelIndex;
  showTextInput.value = true;
}

function editGoalAxiom(levelIndex: number) {
  editLevelIndex.value = levelIndex;
  showAxiomEditor.value = true;
}

function setLevelTitle(title: string): void {
  emit('setLevelTitle', editLevelIndex.value, title);
}

function setGoalAxiom(axiom: AxiomData): void {
  emit('setGoalAxiom', editLevelIndex.value, axiom)
}
</script>