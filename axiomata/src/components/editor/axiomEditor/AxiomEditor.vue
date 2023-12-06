<template>
    <div class="backdrop-axiom-editor" />
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div :style="{ marginTop: (upperSeqSelected ? -15 : 15) + 'vw', color: 'orange', fontSize: 2 + 'vw' }">
                Ausgewählt >>> </div>
            <div class="sequence-editors">
                <SequenceContainer title="START" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.upperSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = true"
                    @symbolClicked="removeFromUpperSeq" />
                <SequenceContainer title="ZIEL" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.lowerSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = false"
                    @symbolClicked="removeFromLowerSeq" />
            </div>
            <SymbolBar :editID="editID" :symbols="symbols"
                @updateSymbols="(updatedSymbols) => emit('updateSymbols', updatedSymbols)" @symbolClicked="addSymbol" />
        </div>
        <div class="button-container">
            <div class="axiom-cancel-button" @click="emit('closeAxiomEditor')"> Abbrechen </div>
            <div v-if="axiomValid(axiom)" class="axiom-save-button" @click="emit('saveAxiom', axiom)"> Speichern </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AxiomData, SeqSymbol, SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref, withDefaults } from 'vue';
import SymbolBar from './SymbolBar.vue'
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import { axiomValid } from '@/scripts/AxiomMethods';

interface Props {
    editID: any;
    axiom: AxiomData | undefined;
    symbols: SymbolData[] | undefined;
}

const props = withDefaults(defineProps<Props>(), {
    axiom: () => ({ upperSequence: [], lowerSequence: [] })
});
const emit = defineEmits(['updateSymbols', 'saveLevel', 'closeAxiomEditor', 'saveAxiom']);

const upperSeqSelected: Ref<boolean> = ref(true);
const axiom: Ref<AxiomData> = ref({
    upperSequence: props.axiom ? [...props.axiom.upperSequence] : [],
    lowerSequence: props.axiom ? [...props.axiom.lowerSequence] : []
});

function addSymbol(symbol: SeqSymbol): void {
    if (upperSeqSelected.value) {
        axiom.value?.upperSequence.push(symbol);
    } else {
        axiom.value?.lowerSequence.push(symbol);
    }
    console.log(axiom.value);
}

function removeFromUpperSeq(index: number): void {
    axiom.value.upperSequence.splice(index, 1);
}

function removeFromLowerSeq(index: number): void {
    axiom.value.lowerSequence.splice(index, 1);
}
</script>

<style>
.backdrop-axiom-editor {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    opacity: 70%;
}

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

.button-container {
    display: flex;
}

.axiom-cancel-button {
    display: grid;
    place-items: center;
    border: 0.2vw solid black;
    border-radius: 2vw;
    font-size: 2vw;
    padding: 3vw;
    background: rgb(230, 33, 3);
    user-select: none;
}

.axiom-save-button {
    display: grid;
    place-items: center;
    border: 0.2vw solid black;
    border-radius: 2vw;
    font-size: 2vw;
    padding: 3vw;
    background: green;
    user-select: none;
}
</style>