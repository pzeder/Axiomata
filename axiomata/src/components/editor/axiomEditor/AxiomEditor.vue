<template>
    <div class="backdrop-axiom-editor" />
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div :style="{ marginTop: (upperSeqSelected ? -15 : 15) + 'vw', color: 'orange', fontSize: 2 + 'vw' }">
                Ausgewählt >>> </div>
            <div class="sequence-editors">
                <SequenceContainer :title="upTitle" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.upperSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = true"
                    @symbolClicked="removeFromUpperSeq" />
                <SequenceContainer :title="lowTitle" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.lowerSequence" :symbols="symbols" :variables=[] @click="upperSeqSelected = false"
                    @symbolClicked="removeFromLowerSeq" />
            </div>
            <SymbolList :symbols="symbols" @addSymbol="(symbol) => emit('addSymbol', symbol)" @deleteSymbol="deleteSymbol"
                @symbolClicked="(index) => addSymbolToSequence({ type: 'terminal', index: index })" />
        </div>
        <div class="button-container">
            <div class="axiom-cancel-button" @click="emit('close')"> Abbrechen </div>
            <div v-if="axiomValid(axiom)" class="axiom-save-button" @click="emit('saveAxiom', axiom)"> Speichern </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolPointer, SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref, withDefaults } from 'vue';
import SymbolList from './SymbolList.vue'
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import { axiomValid } from '@/scripts/AxiomMethods';

interface Props {
    axiom: AxiomData | undefined;
    symbols: SymbolData[] | undefined;
    upTitle: string;
    lowTitle: string;
}

const props = withDefaults(defineProps<Props>(), {
    axiom: () => ({ upperSequence: [], lowerSequence: [] })
});
const emit = defineEmits(['addSymbol', 'deleteSymbol', 'saveAxiom', 'close']);

const upperSeqSelected: Ref<boolean> = ref(true);
const axiom: Ref<AxiomData> = ref({
    upperSequence: props.axiom ? [...props.axiom.upperSequence] : [],
    lowerSequence: props.axiom ? [...props.axiom.lowerSequence] : []
});

function deleteSymbol(index: number) {
    axiom.value.upperSequence = [];
    axiom.value.lowerSequence = [];
    emit('deleteSymbol', index);
}

function addSymbolToSequence(symbolPointer: SymbolPointer): void {
    if (upperSeqSelected.value) {
        axiom.value?.upperSequence.push(symbolPointer);
    } else {
        axiom.value?.lowerSequence.push(symbolPointer);
    }
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
    z-index: 300;
}

.axiom-editor-screen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
    z-index: 301;
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