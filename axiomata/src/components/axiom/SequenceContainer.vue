<template>
  <div class="sequence-container" :style="{ width: width + 'vw', height: height + 'vw', borderColor: borderColor }">
    <div class="sequence-header" :style="{ fontSize: (height * 0.15) + 'vw' }"> {{ header }}
    </div>
    <SequenceComp :symbolWidth="symbolWidth" :sequence="sequence" :symbols="symbols" :highlights="highlights"
      :variables="variables" :varMap="varMap" @symbolClicked="(index) => emit('symbolClicked', index)" />
    <div class="sequence-footer" :style="{ fontSize: (height * 0.15) + 'vw', color: borderColor }"> {{ footer }} </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, defineEmits } from 'vue';
import { SymbolPointer, SymbolData } from '@/scripts/Interfaces';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  header: string;
  footer: string;
  footerColor: string;
  width: number;
  height: number;
  maxFill: number;
  maxSymbolWidthRatio: number;
  sequence: SymbolPointer[] | null;
  symbols: SymbolData[] | undefined;
  highlights: boolean[];
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
  borderColor: string;
}

const props = withDefaults(defineProps<Props>(), {
  header: () => '',
  footer: () => '',
  footerColor: () => 'transparent',
  highlights: () => [],
  varMap: () => new Map<number, SymbolPointer>(),
  borderColor: () => 'transparent'
});

const emit = defineEmits(['symbolClicked']);

const symbolWidth = computed(() => {
  if (!props.sequence) {
    return 0;
  }
  const w: number = props.maxFill * props.width / props.sequence.length;
  const maxWidth: number = props.maxSymbolWidthRatio * props.width;
  return Math.min(w, maxWidth);
});
</script>

<style>
.sequence-container {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
  border: 1vw solid;
}

.sequence-header {
  position: absolute;
  color: black;
  top: 0;
  user-select: none;
  display: grid;
  place-items: center;
}

.sequence-footer {
  position: absolute;
  bottom: 0;
  user-select: none;
  display: grid;
  place-items: center;
}
</style>