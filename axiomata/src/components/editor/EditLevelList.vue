<template>
  <div v-for="(level, index) in levels" :key="index">
    <AddButton target="level" @click="emit('addNewLevel', index)" />
    <EditLevel :title="level.title" :index="index" @editLevelTitle="emit('editLevelTitle', index)"
      @deleteLevel="emit('deleteLevel', index)" />
  </div>
  <AddButton target="level" @click="emit('addNewLevel', levels.length)" />
</template>

<script setup lang="ts">
import { LevelData } from '@/scripts/Interfaces';
import { defineProps, defineEmits } from 'vue';
import AddButton from '@/components/editor/AddButton.vue'

interface Props {
  levels: LevelData[];
}

const props = defineProps<Props>();
const emit = defineEmits(['addNewLevel', 'editLevelTitle', 'deleteLevel'])
</script>