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
import { SymbolData } from "@/scripts/Interfaces";
import { computed, defineProps } from "vue";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  highlight: boolean;
  symbolData: SymbolData | null;
}
const props = defineProps<Props>();

const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);
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