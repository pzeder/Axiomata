<template>
  <div v-if="symbolData" class="symbol" :style="{
    width: symbolWidth + 'vw',
    height: symbolHeight + 'hw',
    backgroundColor: symbolData.backgroundColor,
    color: symbolData.textColor,
    borderColor: (highlight) ? 'rgb(180, 180, 180)' : 'rgb(100, 100, 100)',
    borderWidth: (symbolWidth / 13) + 'vw',
    borderRadius: (symbolWidth / 5) + 'vw',
    marginLeft: (-symbolWidth / 13) + 'vw',
    fontSize: (symbolWidth * screenRatio * 0.5) + 'vh'
  }"> {{ symbolData.text }} </div>
</template>

<script setup lang="ts">
import { SeqSymbol, SeqVar, SymbolData, VarData } from "@/scripts/Interfaces";
import { computed, defineProps, withDirectives } from "vue";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  highlight: boolean;
  symbol: SeqSymbol;
  symbolAlphabet: SymbolData[];
  variables: VarData[];
  varColors: string[];
}
const props = defineProps<Props>();

const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);

const symbolData = computed(() => {
  if (typeof props.symbol === 'number') {
    return props.symbolAlphabet[props.symbol];
  }
  if ('varIndex' in props.symbol && 'colorIndex' in props.symbol) {
    const variable = props.symbol as SeqVar;
    return {
      backgroundColor: props.varColors[variable.colorIndex],
      text: props.variables[variable.varIndex].varText,
      textColor: 'white'
    };
  }
  return null;
});
</script>

<style scoped>
.symbol {
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  user-select: none;
}
</style>