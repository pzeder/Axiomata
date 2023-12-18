<template>
  <div v-if="symbol" class="symbol" :style="{
    width: symbolWidth + 'vw',
    height: symbolWidth + 'vw',
    background: backgroundColor,
    color: getColorString(symbol.textColor),
    borderColor: borderColor,
    borderWidth: (symbolWidth * 0.077) + 'vw',
    borderRadius: borderRadius + 'vw',
    marginLeft: (shiftLeft ? -symbolWidth * 0.077 : 0) + 'vw',
    fontSize: (symbol.fontSize / 100 * symbolWidth) + 'vw'
  }"> {{ symbol.text }} </div>
</template>

<script setup lang="ts">
import { ColorValue, SymbolData, SymbolType } from "@/scripts/Interfaces";
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
  (props.symbol?.type === SymbolType.TERMINAL ? 0.2 : 0.6) * props.symbolWidth);

const borderColor: ComputedRef<string> = computed(() =>
  props.highlight ? 'rgb(144, 144, 144)' : 'rgb(42, 42, 42)');

function getColorString(rgb: ColorValue): string {
  return 'rgb(' + rgb.red + ',' + rgb.green + ',' + rgb.blue + ')';
}

const backgroundColor: ComputedRef<string> = computed(() =>
  props.symbol?.type === SymbolType.TERMINAL ? getColorString(props.symbol.backgroundColor) : 'linear-gradient(45deg, red, orange, yellow, lightgreen, lightblue, violet)');
</script>

<style>
.symbol {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  user-select: none;
}
</style>