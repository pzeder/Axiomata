<template>
  <div class="sequence-container" :style="{ width: width + 'vw', height: height + 'vw' }">
    <div class="sequence-title" :style="{ width: width + 2 + 'vw', fontSize: (height * 0.15) + 'vw' }"> {{ title }} </div>
    <SequenceComp :symbolWidth="symbolWidth" :sequence="sequence" :symbols="symbols" :highlights="highlights"
      :variables="variables" :varMap="varMap" @symbolClicked="(index) => emit('symbolClicked', index)" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, defineEmits } from 'vue';
import { SymbolPointer, SymbolData } from '@/scripts/Interfaces';
import SequenceComp from '@/components/axiom/SequenceComp.vue';

interface Props {
  title: string;
  width: number;
  height: number;
  maxFill: number;
  maxSymbolWidthRatio: number;
  sequence: SymbolPointer[] | undefined;
  symbols: SymbolData[] | undefined;
  highlights: boolean[];
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
}

const props = withDefaults(defineProps<Props>(), {
  title: () => '',
  highlights: () => [],
  varMap: () => new Map<number, SymbolPointer>()
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
  border: 1vw solid rgb(89, 204, 245);
}

.sequence-title {
  position: absolute;
  color: black;
  left: -1;
  top: 0;
  user-select: none;
  display: grid;
  place-items: center;
}
</style>