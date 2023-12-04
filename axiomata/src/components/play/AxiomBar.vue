<template>
  <div class="axiom-bar"
    :style="{ width: width + 'vw', height: height + 'vw', backgroundColor: background }">
    <div class="axiom-bar-title" :style="{ position: (vertical ? 'static' : 'absolute')}"> {{ title }} </div>
    <div v-if="vertical"> 
      <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :width="containerWidth" :height="containerHeight"
      :axiom="axiom" :symbols="symbols" :variables="variables" :varColors="varColors"
      @selectAxiom="(event) => emit('selectAxiom', event, axiom)" />
    </div>
    <div v-if="!vertical" :style="{ display: 'flex'}">
      <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :width="containerWidth" :height="containerHeight"
      :axiom="axiom" :symbols="symbols" :variables="variables" :varColors="varColors"
      @selectAxiom="(event) => emit('selectAxiom', event, axiom)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import { computed, defineProps, defineEmits, Ref, ref } from 'vue';
import AxiomContainer from '@/components/axiom/AxiomContainer.vue'

interface Props {
  title: string;
  background: string;
  width: number;
  height: number;
  axioms: AxiomData[] | undefined;
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  varColors: string[];
}
const props = defineProps<Props>();
const emit = defineEmits(['selectAxiom', 'mouseOver']);

const vertical = computed(() => props.width < props.height);
const maxContainerWidth = computed(() => vertical.value ? props.width : props.height);
const minContainerWidth = computed(() => vertical.value || !props.axioms ? props.width : props.width / props.axioms.length)
const containerWidth = computed(() => Math.min(minContainerWidth.value, maxContainerWidth.value));
const maxContainerHeight = computed(() => vertical.value ? 0.5 * props.width : props.height);
const minContainerHeight = computed(() => vertical.value && props.axioms ? props.height / props.axioms.length : props.height);
const containerHeight = computed(() => Math.min(minContainerHeight.value, maxContainerHeight.value));
</script>

<style>
.axiom-bar-title {
  font-size: 1.5vw;
  color: rgb(120, 120, 120);
  margin-left: 2vw;
  margin-top: 0.4vw;
  user-select: none;
}
</style>