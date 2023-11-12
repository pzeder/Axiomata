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
import { computed, defineProps } from "vue";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  symbolData: SymbolData;
}
const props = defineProps<Props>();

const symbolHeight = computed(() => props.symbolWidth * props.screenRatio);
</script>

<style scoped>
.symbol {
  display: grid;
  place-items: center;
  border: 0.5vw solid rgb(187, 187, 187);
  border-radius: 1vw;
  margin-left: -0.5vw;
  user-select: none;
}
</style>