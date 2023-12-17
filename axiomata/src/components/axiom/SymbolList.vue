<template>
    <div class="symbol-list">
        <div class="symbol-list-title"> {{ title }} </div>
        <div class="symbol-package" v-for="(symbol, index) in symbols" :key="index">
            <SymbolComp :symbolWidth=4 :symbol="symbol" @click="emit('symbolClicked', { type: type, index: index })" />
            <div class="var-target-tag" v-if="showVarTags" :style="{ color: varTagColor(symbol) }"
                @click="emit('toggleVarTarget', { type: type, index: index })"> V </div>
            <div class="symbol-delete-button" @click="emit('deleteSymbol', { type: type, index: index })"> Löschen
            </div>
        </div>
        <div class="symbol-add-button" @click="showSymbolEditor = true"> {{ addButtonText }} </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import { SymbolData, SymbolType } from '@/scripts/Interfaces';

interface Props {
    symbols: SymbolData[] | undefined;
    type: SymbolType;
    showVarTags: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'addSymbol', 'deleteSymbol', 'symbolClicked', 'toggleVarTarget']);

const showSymbolEditor: Ref<boolean> = ref(false);
const title: ComputedRef<string> = computed(() => props.type === SymbolType.VARIABLE ? "Variablen" : "Symbole");
const addButtonText: ComputedRef<string> = computed(() =>
    props.type === SymbolType.VARIABLE ? "Neue Variable erstellen" : "Neues Symbol erstellen");


function varTagColor(symbol: SymbolData): string {
    return symbol.varTarget ? 'orange' : 'gray';
}
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

.var-target-tag {
    font-size: 2vw;
    padding: 1vw;
    margin-left: 2vw;
    display: grid;
    place-items: center;
    user-select: none;
}

.symbol-add-button {
    width: 20vw;
    height: 5vh;
    border: 2px solid black;
    border-radius: 5vw;
    margin-top: 2vw;
    margin-bottom: 2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    user-select: none;
    background: rgb(104, 206, 104);
}
</style>