<template>
  <div class="sequence">
    <SymbolComp v-for="(symbol, index) in sequence" :key="index" :symbolWidth="symbolWidth"
      :highlight="(highlights.length === 0) ? false : highlights[index]" :symbol="symbolData(symbol)" :symbols="symbols"
      :variables="variables" :varMap="varMap" :shiftLeft="index !== 0 && false" @click="emit('symbolClicked', index)" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, defineEmits } from "vue";
import SymbolComp from '@/components/axiom/SymbolComp.vue'
import { SymbolData, VarData, SeqSymbol, SeqVar } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  sequence: SeqSymbol[] | undefined;
  highlights: boolean[];
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  varMap: Map<string, number>;
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  varMap: () => new Map<string, number>()
});

const emit = defineEmits(['symbolClicked']);

function symbolData(symbol: SeqSymbol): SymbolData | null {
  if (!props.symbols || !props.variables) {
    return null;
  }
  if (typeof symbol === 'number') {
    return props.symbols[symbol];
  }
  if ('varIndex' in symbol && 'colorIndex' in symbol) {
    const variable = symbol as SeqVar;
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
}
</script>

<style scoped>
.sequence {
  display: flex;
}
</style>