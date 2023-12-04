<template>
  <div class="sequence">
    <SymbolComp v-for="(symbol, index) in sequence" :key="index" :symbolWidth="symbolWidth"
      :highlight="(highlights.length === 0) ? false : highlights[index]" :symbol="symbol" :symbols="symbols"
      :variables="variables" :varColors="varColors" :varMap="varMap" :shiftLeft="index !== 0"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import SymbolComp from '@/components/axiom/SymbolComp.vue'
import { SymbolData, VarData, SeqSymbol } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  sequence: SeqSymbol[] | undefined;
  highlights: boolean[];
  symbols: SymbolData[] | undefined;
  variables: VarData[] | undefined;
  varColors: string[];
  varMap: Map<string, number>;
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  varMap: () => new Map<string, number>()
});
</script>

<style scoped>
.sequence {
  display: flex;
}
</style>