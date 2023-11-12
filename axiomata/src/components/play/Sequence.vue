<template>
    <div class="sequence" :style="{
        width: (symbolIndices.length * symbolWidth) + 'vw',
        height: symbolHeight + 'vh'
    }"> 
        <Symbol v-for="(si, key) in symbolIndices" :key="key" 
            :symbolWidth="symbolWidth" :screenRatio="screenRatio" :highlight="(highlights.length === 0) ? false : highlights[key]" :symbolData="symbolAlphabet[si]" />
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import Symbol from '@/components/play/Symbol.vue'
import { SymbolData } from "@/scripts/Interfaces";

interface Props {
  symbolWidth: number;
  screenRatio: number;
  symbolIndices: number[];
  highlights: boolean[];
  symbolAlphabet: SymbolData[];
}
const props = withDefaults(defineProps<Props>(), {
  highlights: () => [] // setting default value for highlights as an empty array
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

.sequence > :first-child {
  margin-left: 0; 
  margin-top: 0; 
}
</style>