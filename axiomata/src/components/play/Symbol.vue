<template>
    <div v-if="symbolData" class="symbol" :style="{
            width: symbolWidth + 'vw',
            height: symbolHeight + 'hw',
            backgroundColor: symbolData.backgroundColor,
            color: symbolData.textColor,
            borderColor: (highlight) ? 'rgb(180, 180, 180)' : 'rgb(100, 100, 100)'
        }"> {{ symbolData.text }} </div>
</template>

<script setup lang="ts">
import { SymbolData } from "@/scripts/Interfaces";
import { computed, defineProps } from "vue";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  highlight: boolean;
  symbolData: SymbolData;
}
const props = defineProps<Props>();

const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);
</script>

<style scoped>
.symbol {
  display: grid;
  place-items: center;
  border-width: 0.5vw ;
  border-style: solid;
  border-radius: 1vw;
  margin-left: -0.5vw;
  user-select: none;
}
</style>