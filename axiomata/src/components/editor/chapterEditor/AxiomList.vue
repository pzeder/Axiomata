<template>
  <div class="axiom-list">
    <div class="axiom-list-title"> {{ title }} </div>
    <div :style="{ display: 'flex' }">
      <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :width="containerWidth" :height="containerWidth"
        :axiom="axiom" :symbols="symbols" :variables="[]" :varColors="[]"
        @selectAxiom="(event) => console.log('click')" />
      <div class="add-axiom-button" @click="emit('editNewAxiom')"> Tauschregel hinzufügen </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed, defineProps, defineEmits } from 'vue';
import AxiomContainer from '@/components/axiom/AxiomContainer.vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';

interface Props {
  title: string;
  axioms: AxiomData[];
  symbols: SymbolData[];
  maxWidth: number;
  containerWidth: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['editNewAxiom']);

const maxContainerWidth: ComputedRef<number> = computed(() => props.maxWidth / props.axioms.length);
const containerWidth: ComputedRef<number> = computed(() => Math.min(props.containerWidth, maxContainerWidth.value));
</script>

<style>
.axiom-list {
  background: white;
  border: 0.5vw solid black;
  border-radius: 2vw;
  margin-top: 2vw;
  margin-bottom: 2vw;
}

.axiom-list-title {
  font-size: 2vw;
  color: gray;
  display: grid;
  place-items: center;
}
</style>