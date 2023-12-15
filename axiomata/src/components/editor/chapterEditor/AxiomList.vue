<template>
  <div class="axiom-list">
    <div class="axiom-list-title" v-if="title !== ''"> {{ title }} </div>
    <div :style="{ display: 'flex' }">
      <div class="axiom-package" v-for="(axiom, index) in axioms" :key="index">
        <AxiomContainer :width="containerWidth" :height="containerWidth" :axiom="axiom" :symbols="symbols"
          :variables="variables" />
        <div class="axiom-delete-button" v-if="editable" @click="emit('deleteAxiom', index)"> löschen </div>
      </div>
      <div class="axiom-add-button" v-if="editable" @click="emit('editNewAxiom')"> Tauschregel hinzufügen </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed, defineProps, defineEmits, withDefaults } from 'vue';
import AxiomContainer from '@/components/axiom/AxiomContainer.vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';

interface Props {
  title: string;
  axioms: AxiomData[];
  symbols: SymbolData[];
  variables: SymbolData[];
  maxWidth: number;
  containerWidth: number;
  editable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: () => false
});
const emit = defineEmits(['editNewAxiom', 'deleteAxiom']);

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
  padding: 1vw;
}

.axiom-package {
  display: grid;
  place-items: center;
}

.axiom-add-button {
  display: grid;
  place-items: center;
  border: 0.2vw solid black;
  border-radius: 2vw;
  font-size: 2vw;
  padding: 2vw;
  background: rgb(247, 247, 110);
}

.axiom-delete-button {
  display: grid;
  place-items: center;
  background: red;
  border: 0.3vw solid black;
  border-radius: 0.5vw;
  font-size: 2vw;
  padding: 1vw;
  margin-top: -2vw;
}
</style>