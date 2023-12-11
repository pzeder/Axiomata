<template>
  <div v-if="symbol" class="symbol" :style="{
    width: symbolWidth + 'vw',
    height: symbolWidth + 'vw',
    backgroundColor: symbol.backgroundColor,
    color: symbol.textColor,
    borderColor: borderColor,
    borderWidth: (symbolWidth * 0.077) + 'vw',
    borderRadius: borderRadius + 'vw',
    marginLeft: (shiftLeft ? -symbolWidth * 0.077 : 0) + 'vw',
    fontSize: (symbol.fontSize / 100 * symbolWidth) + 'vw'
  }"> {{ symbol.text }} </div>
</template>

<script setup lang="ts">
import { SymbolData, SymbolType } from "@/scripts/Interfaces";
import { ComputedRef, computed, defineProps, withDefaults } from "vue";

interface Props {
  symbolWidth: number;
  highlight: boolean;
  symbol: SymbolData | null;
  shiftLeft: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  highlight: () => false,
  shiftLeft: () => false
});

const borderRadius: ComputedRef<number> = computed(() =>
  (props.symbol?.type === SymbolType.VARIABLE ? 0.6 : 0.2) * props.symbolWidth);

const borderColor: ComputedRef<string> = computed(() =>
  props.highlight ? 'rgb(180, 180, 180)' : 'rgb(100, 100, 100)');
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