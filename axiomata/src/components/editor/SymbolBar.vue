
import SymbolComp from '../axiom/SymbolComp.vue';

<template>
    <div class="symbol-bar">
        <div class="symbol-bar-title"> Verfügbare Symbole </div>
        <SymbolComp v-for="(symbol, index) in symbols" :key="index" :symbolWidth=3 :symbol="symbol" />
        <DeleteButton class="delete-symbol" v-if="symbols && symbols.length > 0" text="Letzes Symbol löschen"
            @click="emit('deleteSymbol')" />
        <AddButton target="symbol" @click="emit('openSymbolEditor')" />
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

.delete-symbol {
    margin-top: 1vw;
    display: grid;
    place-items: center;
}
</style>