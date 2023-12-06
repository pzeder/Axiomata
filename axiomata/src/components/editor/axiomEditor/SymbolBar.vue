<template>
    <div class="symbol-bar">
        <div class="symbol-bar-title"> Symbole </div>
        <SymbolComp v-for="(symbol, index) in symbols" :key="index" :symbolWidth=3 :symbol="symbol"
            @click="emit('symbolClicked', index)" />
        <DeleteButton class="delete-symbol" v-if="symbols && symbols.length > 0" text="Letztes Symbol löschen"
            @click="deleteSymbol" />
        <AddButton target="symbol" @click="showSymbolEditor = true" />
    </div>
    <SymbolEditor v-if="showSymbolEditor" :editID="editID" @closeSymbolEditor="showSymbolEditor = false"
        @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, Ref, ref } from 'vue';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import AddButton from '../AddButton.vue';
import DeleteButton from '../DeleteButton.vue';
import SymbolEditor from '../symbolEditor/SymbolEditor.vue';
import { SymbolData } from '@/scripts/Interfaces';
import axios from 'axios';

interface Props {
    editID: any
    symbols: SymbolData[] | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'updateSymbols', 'symbolClicked']);

const showSymbolEditor: Ref<boolean> = ref(false);

async function deleteSymbol(): Promise<void> {
    if (!props.symbols) {
        return;
    }
    try {
        const updateData = {
            editID: props.editID,
            symbolIndex: props.symbols.length - 1
        };
        const response = await axios.patch('http://localhost:3000/deleteSymbol', updateData);
        if (response.status === 200) {
            const updatedSymbols: SymbolData[] = response.data.symbols;
            emit('updateSymbols', updatedSymbols);
        } else {
            console.error('Server responded with status', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
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
}
</style>