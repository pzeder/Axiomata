<template>
  <div class="edit-level">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <div class="empty-button" v-if="!axiomValid(level.goalAxiom)" @click="emit('editGoalAxiom')">
        START / ZIEL festlegen
      </div>
      <AxiomContainer v-if="axiomValid(level.goalAxiom)" :width="20" :height="20" :axiom="level.goalAxiom"
        :symbols="symbols" :variables="[]" :varColors="[]" @click="emit('editGoalAxiom')" />
      <TitleBar :title="level.title" :height=5 @editTitle="emit('editLevelTitle')" />
    </div>
    <DeleteButton text="Level löschen" @click="emit('deleteLevel')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TitleBar from '../TitleBar.vue'
import AxiomContainer from '@/components/axiom/AxiomContainer.vue';
import DeleteButton from '@/components/editor/DeleteButton.vue';
import { LevelData, SymbolData } from '@/scripts/Interfaces';
import { axiomValid } from '@/scripts/AxiomMethods';

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

.empty-button {
  display: grid;
  place-items: center;
  border: 0.2vw solid black;
  border-radius: 2vw;
  font-size: 2vw;
  padding: 1vw;
  background: rgb(247, 247, 110);
}
</style>