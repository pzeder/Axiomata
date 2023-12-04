
import SymbolComp from '../axiom/SymbolComp.vue';

<template>
    <div class="symbol-bar"> 
        <div class="symbol-bar-title"> Verfügbare Symbole </div>
        <SymbolComp :symbolWidth=3 :symbol="index" :symbols="symbols" v-for="(symbol, index) in symbols" :key="index"/>
        <AddButton target="symbol" @click="emit('openSymbolEditor')"/>
        <DeleteButton text="Letzes Symbol löschen" @click="emit('deleteSymbol')"/>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import SymbolComp from '../axiom/SymbolComp.vue';
import AddButton from './AddButton.vue';
import DeleteButton from './DeleteButton.vue';
import { SymbolData } from '@/scripts/Interfaces';

interface Props {
    symbols: SymbolData[] | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'deleteSymbol']);
</script>

<style>
.symbol {
    color: white;
    width: 5vw;
    height: 5vw;
}

.symbol-bar {
    display: grid;
    place-items: center;
    background: black;
}

.symbol-bar-title {
    font-size: 2vw;
    color: white;
}
</style>