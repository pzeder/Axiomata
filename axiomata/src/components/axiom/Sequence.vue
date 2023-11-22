<template>
  <div class="sequence" :style="{
    width: (sequence.length * symbolWidth) + 'vw',
    height: symbolHeight + 'vh'
  }">
    <Symbol v-for="(symbol, key) in sequence" :key="key" :symbolWidth="symbolWidth" :screenRatio="screenRatio"
      :highlight="(highlights.length === 0) ? false : highlights[key]" :symbolData="symbolData(symbol)" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import Symbol from '@/components/axiom/Symbol.vue'
import { SeqVar, SymbolData, VarData } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  sequence: Symbol[];
  highlights: boolean[];
  symbolAlphabet: SymbolData[];
  variables: VarData[];
  varColors: string[];
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => []
});
const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);

function symbolData(symbol: Symbol): (SymbolData | null) {
  if (typeof symbol === 'number') {
    return props.symbolAlphabet[symbol];
  }
  if ('varIndex' in symbol && 'colorIndex' in symbol) {
    const variable = symbol as SeqVar;
    const symbolIndex: number = props.variables[variable.varIndex].symbolIndex;
    const data: SymbolData = props.symbolAlphabet[symbolIndex];
    return {
      backgroundColor: props.varColors[variable.colorIndex],
      text: data.text,
      textColor: data.textColor
    };
  }
  return null;
}
</script>

<style scoped>
.sequence {
  display: flex;
  position: absolute;
  background-color: none;
  color: white;
}

.sequence> :first-child {
  margin-left: 0;
  margin-top: 0;
}
</style>