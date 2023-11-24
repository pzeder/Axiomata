<template>
  <div class="sequence" :style="{
    width: (sequence.length * symbolWidth) + 'vw',
    height: symbolHeight + 'vh'
  }">
    <SymbolComp v-for="(symbol, key) in sequence" :key="key" :symbolWidth="symbolWidth" :screenRatio="screenRatio"
      :highlight="(highlights.length === 0) ? false : highlights[key]" :symbol="symbol" :symbolAlphabet="symbolAlphabet"
      :variables="variables" :varColors="varColors" :varMap="varMap" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import SymbolComp from '@/components/axiom/SymbolComp.vue'
import { SymbolData, VarData, SeqSymbol } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  sequence: SeqSymbol[];
  highlights: boolean[];
  symbolAlphabet: SymbolData[];
  variables: VarData[];
  varColors: string[];
  varMap: Map<string, number>;
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => [],
  varMap: () => new Map<string, number>()
});
const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);
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