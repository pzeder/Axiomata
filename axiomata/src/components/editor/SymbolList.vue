<template>
    <div class="symbol-list">
        <div class="symbol-list-title"> {{ title }} </div>
        <div class="symbol-package" v-for="(symbol, index) in symbols" :key="index">
            <SymbolComp :symbolWidth=5 :symbol="symbol" @click="emit('symbolClicked', { type: type, index: index })" />
            <div class="var-target-tag" v-if="showVarTags" :style="{ color: varTagColor(symbol) }"
                @click="emit('toggleVarTarget', { type: type, index: index })"> V </div>
            <TextButton text="Ändern" background="yellow" @click="emit('editSymbol', { type: type, index: index })" />
            <TextButton text="Löschen" @click="emit('deleteSymbol', { type: type, index: index })" />
        </div>
        <div class="symbol-add-button" v-if="symbols">
            <TextButton :text="addButtonText" background="lightgreen"
                @click="emit('editSymbol', { type: type, index: symbols.length })" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref, ComputedRef, computed } from 'vue';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import { SymbolData, SymbolType } from '@/scripts/Interfaces';
import TextButton from '../UI/TextButton.vue';

interface Props {
    symbols: SymbolData[] | undefined;
    type: SymbolType;
    showVarTags: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'editSymbol', 'deleteSymbol', 'symbolClicked', 'toggleVarTarget']);

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
    padding-left: 1vw;
    padding-right: 1vw;
    gap: 1vw;
}

.symbol-delete-button {
    padding: 1vw;
    display: grid;
    place-items: center;
}

.var-target-tag {
    font-size: 2vw;
    padding: 1vw;
    display: grid;
    place-items: center;
    user-select: none;
}

.symbol-add-button {
    margin: 2vw;
    display: grid;
    place-items: center;
}
</style>