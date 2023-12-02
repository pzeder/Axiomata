<template>
  <div v-if="symbolData" class="symbol" :style="{
    width: symbolWidth + 'vw',
    height: symbolWidth + 'vw',
    backgroundColor: symbolData.backgroundColor,
    color: symbolData.textColor,
    borderColor: borderColor,
    borderWidth: (symbolWidth / 13) + 'vw',
    borderRadius: (symbolWidth / 5) + 'vw',
    marginLeft: (-symbolWidth / 13) + 'vw',
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
}
const props = withDefaults(defineProps<Props>(), {
  highlight: () => false,
  variables: () => [],
  varColors: () => [],
  varMap: () => new Map<string, number>()
});

const symbolData = computed(() => {
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
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  user-select: none;
}
</style>