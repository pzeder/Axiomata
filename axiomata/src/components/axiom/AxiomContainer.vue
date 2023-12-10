<template>
  <div class="axiom-container" @touchstart="handleTouchStart" :style="{ width: width + 'vw', height: height + 'vw' }">
    <AxiomComp :symbolWidth="symbolWidth" :axiomData="axiom" :symbols="symbols" :variables="variables" :varMap="varMap"
      @mousedown="(event) => selectAxiom(event, axiom)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue';
import { AxiomData, SymbolData, SymbolPointer } from '@/scripts/Interfaces';
import AxiomComp from '@/components/axiom/AxiomComp.vue';
import { maxSequenceLength } from '@/scripts/AxiomMethods';

interface Props {
  width: number;
  height: number;
  axiom: AxiomData;
  symbols: SymbolData[] | undefined;
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<number, SymbolPointer>()
});

const emit = defineEmits(['selectAxiom', 'mouseOver']);

function selectAxiom(event: MouseEvent | Touch, axiom: AxiomData): void {
  emit('selectAxiom', event, axiom);
}

function handleTouchStart(event: TouchEvent): void {
  event.preventDefault();
  selectAxiom(event.touches[0], props.axiom)
}

const symbolWidth = computed(() => {
  const w: number = 0.8 * props.width / maxSequenceLength(props.axiom);
  const maxWidth: number = 0.15 * props.width;
  return Math.min(w, maxWidth);
});
</script>

<style>
.axiom-container {
  display: grid;
  place-items: center;
}
</style>