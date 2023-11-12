<template>
    <div class="sequence" :style="{
        width: (symbolIndices.length * symbolWidth) + 'vw',
        height: symbolHeight + 'vh'
    }"> 
        <Symbol v-for="(si, key) in symbolIndices" :key="key" 
            :symbolWidth="symbolWidth" :symbolData="symbolAlphabet[si]" />
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted } from "vue";
import Symbol from '@/components/play/Symbol.vue'
import { SymbolData } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  symbolIndices: number[];
  symbolAlphabet: SymbolData[];
}
const props = defineProps<Props>();

const symbolHeight: number = props.symbolWidth * window.innerWidth / window.innerHeight;
</script>

<style scoped>
.sequence {
    display: flex;
    position: absolute;
    background-color: none;
    color: white;
}

.sequence > :first-child {
  margin-left: 0; 
  margin-top: 0; 
}
</style>