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
import { SymbolData, SymbolPointer } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  sequence: SymbolPointer[] | null;
  highlights: boolean[];
  symbols: SymbolData[] | undefined;
  variables: SymbolData[] | undefined;
  varMap: Map<number, SymbolPointer>;
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  varMap: () => new Map<number, SymbolPointer>()
});

const emit = defineEmits(['symbolClicked']);

function symbolData(symbolPointer: SymbolPointer): SymbolData | null {
  if (!props.symbols || !props.variables) {
    return null;
  }
  if (symbolPointer.type === 'variable') {
    const key: number = symbolPointer.index;
    const sp: SymbolPointer | undefined = props.varMap.get(key);
    if (sp !== undefined) {
      symbolPointer = sp;
    }
  }
  if (symbolPointer.type === 'terminal') {
    return props.symbols[symbolPointer.index];
  }
  return props.variables[symbolPointer.index];
}
</script>

<style scoped>
.sequence {
  display: flex;
}
</style>