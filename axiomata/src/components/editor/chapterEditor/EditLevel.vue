<template>
  <div class="edit-level">
    <div :style="{ display: 'flex', alignItems: 'center' }">
      <div class="bonus-tag" :style="{ background: bonusTagColor}" @click="emit('toggleBonus')"> {{ bonusTagText }} </div> 
      <div class="empty-button" v-if="!axiomValid(level.goalAxiom)" @click="emit('editGoalAxiom')">
        START / ZIEL festlegen
      </div>
      <AxiomContainer v-if="axiomValid(level.goalAxiom)" :width="20" :height="20" :axiom="level.goalAxiom"
        :symbols="symbols" :variables="[]" :varColors="[]" @click="emit('editGoalAxiom')" />
      <TitleBar :tag="levelTag" :title="level.title" :height=5 @editTitle="emit('editLevelTitle')"/>
    </div>
    <DeleteButton text="Level löschen" @click="emit('deleteLevel')" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef, computed } from 'vue';
import TitleBar from '../TitleBar.vue'
import AxiomContainer from '@/components/axiom/AxiomContainer.vue';
import DeleteButton from '@/components/editor/DeleteButton.vue';
import { LevelData, SymbolData } from '@/scripts/Interfaces';
import { axiomValid } from '@/scripts/AxiomMethods';

interface Props {
  chapterIndex: number;
  levelIndex: number;
  level: LevelData;
  symbols: SymbolData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['editLevelTitle', 'deleteLevel', 'editGoalAxiom', 'toggleBonus']);

const levelTag: ComputedRef<string> = computed(() =>
  'Level ' + (props.chapterIndex + 1) + '-' + (props.levelIndex + 1));

const bonusTagText: ComputedRef<string> = computed(() => props.level.bonus ? 'BONUS' : 'NORMAL');
const bonusTagColor: ComputedRef<string> = computed(() => props.level.bonus ? 'gold' : 'gray');
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

.bonus-tag {
  display: grid;
  place-items: center;
  font-size: 30pt;
  color: black;
  user-select: none;
  padding: 1vw;
  margin-left: 2vw;
  border: 0.3vw solid black;
  border-radius: 3vw;
}
</style>