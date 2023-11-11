<template>
    <div class="sequence" :style="{
        width: (symbols.length * symbolWidth) + 'vw',
        height: symbolHeight + 'vh'
    }"> 
        <div v-for="symbol in symobls" :key="symbol"> {{ symbol }} </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

interface Props {
  symbolWidth: number;
  symbolHeight: number;
  symbols: number[];
}
const props = defineProps<Props>();
</script>

<style scoped>
.sequence {
    display: flex;
    background-color: red;
    color: white;
}
</style>