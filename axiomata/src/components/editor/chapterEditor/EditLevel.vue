<template>
  <div class="edit-level">
    <TitleBar :title="level.title" :height=5 @editTitle="emit('editLevelTitle')" />
    <AxiomContainer :width="10" :height="10" :axiom="level.goalAxiom" :symbols="symbols" :variables="[]" :varColors="[]"
      @click="emit('editGoalAxiom')" />
    <DeleteButton text="Level löschen" @click="emit('deleteLevel')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from '../TitleBar.vue'
import AxiomContainer from '@/components/axiom/AxiomContainer.vue';
import DeleteButton from '@/components/editor/DeleteButton.vue';
import { LevelData, SymbolData } from '@/scripts/Interfaces';

interface Props {
  level: LevelData;
  symbols: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['editLevelTitle', 'deleteLevel', 'editGoalAxiom']);
</script>

<style>
.edit-level {
  width: 60vw;
  border: 2px solid black;
  border-radius: 1vw;
  margin-bottom: 10px;
  font-size: 20pt;
  user-select: none;
  background-color: rgb(255, 157, 0);
}
</style>