<template>
    <div v-if="symbolData" class="symbol" :style="{
            width: symbolWidth + 'vw',
            height: symbolHeight + 'hw',
            backgroundColor: symbolData.backgroundColor,
            color: symbolData.textColor
        }"> {{ symbolData.text }} </div>
</template>

<script setup lang="ts">
import { SymbolData } from "@/scripts/Interfaces";
import { defineProps } from "vue";

interface Props {
  symbolWidth: number;
  symbolHeight: number;
  symbolData: SymbolData;
}
const props = defineProps<Props>();
</script>

<style scoped>
.symbol {
  display: grid;
  place-items: center;
  border: 0.5vw solid black;
  border-radius: 1vw;
  margin-left: -0.5vw;
  color: black;
  user-select: none;
}
</style>