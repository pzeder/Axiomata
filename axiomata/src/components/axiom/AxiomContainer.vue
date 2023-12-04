<template>
  <div class="axiom-container" @touchstart="handleTouchStart"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh' }">
    <AxiomComp :symbolWidth="symbolWidth" :axiomData="axiom" :symbols="symbols"
      :variables="variables" :varColors="varColors" :varMap="varMap" @mousedown="(event) => selectAxiom(event, axiom)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue';
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import AxiomComp from '@/components/axiom/AxiomComp.vue';
import { maxSequenceLength } from '@/scripts/AxiomMethods';

interface Props {
  posX: number;
  posY: number;
  width: number;
  height: number;
  axiom: AxiomData;
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  varColors: string[];
  varMap: Map<string, number>;
  upperHighlights: boolean[];
  lowerHighlights: boolean[];
}
const props = withDefaults(defineProps<Props>(), {
  upperHighlights: () => [],
  lowerHighlights: () => [],
  varMap: () => new Map<string, number>()
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
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20vh;
}
</style>