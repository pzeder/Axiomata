<template>
    <div class="backdrop" />
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div :style="{ marginTop: (upperSeqSelected ? -15 : 15) + 'vw', color: 'orange', fontSize: 2 + 'vw' }">
                Ausgewählt >>> </div>
            <div class="sequence-editors">
                <SequenceContainer title="START" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.33"
                    :sequence="axiom?.upperSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = true" />
                <SequenceContainer title="ZIEL" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.33"
                    :sequence="axiom?.lowerSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = false" />
            </div>
            <SymbolBar :symbols="symbols" @openSymbolEditor="emit('openSymbolEditor')" @deleteSymbol="emit('deleteSymbol')"
                @symbolClicked="addSymbol" />
        </div>
        <div class="axiom-save-button"> OK </div>
    </div>
</template>

<script setup lang="ts">
import { AxiomData, SeqSymbol, SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref } from 'vue';
import SymbolBar from './SymbolBar.vue'
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';

interface Props {
    symbols: SymbolData[] | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'deleteSymbol']);

const upperSeqSelected: Ref<boolean> = ref(true);
const axiom: Ref<AxiomData> = ref({ upperSequence: [], lowerSequence: [] });

function addSymbol(symbol: SeqSymbol): void {
    if (upperSeqSelected.value) {
        axiom.value?.upperSequence.push(symbol);
    } else {
        axiom.value?.lowerSequence.push(symbol);
    }
    console.log(axiom.value);
}
</script>

<style>
.axiom-editor-screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
}

.axiom-editor {
    display: flex;
    place-items: center;
}

.axiom-save-button {
    display: grid;
    place-items: center;
    border: 0.2vw solid black;
    border-radius: 2vw;
    font-size: 2vw;
    padding: 3vw;
    background: green;
}
</style>