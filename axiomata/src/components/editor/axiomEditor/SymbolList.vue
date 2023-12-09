<template>
    <div class="symbol-list">
        <div class="symbol-list-title"> Symbole </div>
        <div class="symbol-package" v-for="(symbol, index) in symbols" :key="index">
            <SymbolComp :symbolWidth=4 :symbol="symbol" @click="emit('symbolClicked', index)" />
            <div class="symbol-delete-button" text="Letztes Symbol löschen" @click="deleteSymbol(index)"> Löschen </div>
        </div>
        <AddButton class="symbol-add-button" target="symbol" @click="showSymbolEditor = true" />
    </div>
    <SymbolEditor v-if="showSymbolEditor" @close="showSymbolEditor = false"
        @addSymbol="emit('addSymbol')" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref } from 'vue';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import AddButton from '../AddButton.vue';
import SymbolEditor from '../symbolEditor/SymbolEditor.vue';
import { SymbolData } from '@/scripts/Interfaces';

interface Props {
    symbols: SymbolData[] | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'addSymbol', 'symbolClicked']);

const showSymbolEditor: Ref<boolean> = ref(false);
</script>

<style>
.symbol-list {
    display: grid;
    place-items: center;
    background: white;
    border: 0.5vw solid black;
    border-radius: 2vw;
}

.symbol-list-title {
    font-size: 2vw;
    color: grey;
    padding: 1vw;
}

.symbol-package {
    display: flex;
}

.symbol-delete-button {
    background: red;
    border: 0.3vw solid black;
    border-radius: 3vw;
    font-size: 1vw;
    color: black;
    padding: 1vw;
    margin-left: 2vw;
    display: grid;
    place-items: center;
    user-select: none;
}

.symbol-add-button {
    margin-bottom: 2vw;
}
</style>