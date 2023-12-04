<template>
  <div v-if="symbolData" class="symbol" :style="{
    width: symbolWidth + 'vw',
    height: symbolWidth + 'vw',
    backgroundColor: symbolData.backgroundColor,
    color: symbolData.textColor,
    borderColor: borderColor,
    borderWidth: (symbolWidth * 0.077) + 'vw',
    borderRadius: (symbolWidth * 0.2) + 'vw',
    marginLeft: (shiftLeft ? -symbolWidth * 0.077 : 0) + 'vw',
    fontSize: (symbolWidth * 0.5) + 'vw'
  }"> {{ symbolData.text }} </div>
</template>

<script setup lang="ts">
import { SeqSymbol, SeqVar, SymbolData, VarData } from "@/scripts/Interfaces";
import { ComputedRef, computed, defineProps, withDefaults } from "vue";

interface Props {
  symbolWidth: number;
  highlight: boolean;
  symbol: SeqSymbol;
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  varColors: string[];
  varMap: Map<string, number>;
  shiftLeft: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  highlight: () => false,
  variables: () => [],
  varColors: () => [],
  varMap: () => new Map<string, number>(),
  shiftLeft: () => false
});

const symbolData = computed(() => {
  if (!props.symbols) {
    return null;
  }
  if (typeof props.symbol === 'number') {
    return props.symbols[props.symbol];
  }
  if ('varIndex' in props.symbol && 'colorIndex' in props.symbol) {
    const variable = props.symbol as SeqVar;
    let key = `${variable.varIndex},${variable.colorIndex}`;
    if (props.varMap.get(key) || props.varMap.get(key) === 0) {
      let symbolIndex: number = props.varMap.get(key) as number;
      return props.symbols[symbolIndex];
    }
    return {
      backgroundColor: 'white',
      text: props.variables[variable.varIndex].varText,
      textColor: 'grey'
    };
  }
  return null;
});

const borderColor: ComputedRef<string> = computed(() => {
  if (typeof props.symbol !== 'number' && 'varIndex' in props.symbol && 'colorIndex' in props.symbol) {
    const variable = props.symbol as SeqVar;
    return props.varColors[variable.colorIndex];
  }
  return (props.highlight) ? 'rgb(180, 180, 180)' : 'rgb(100, 100, 100)';
});
</script>

<style scoped>
.symbol {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  user-select: none;
}
</style>