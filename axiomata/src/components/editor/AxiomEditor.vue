<template>
    <div class="backdrop-axiom-editor" />
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div :style="{ marginTop: (upperSeqSelected ? -15 : 15) + 'vw', color: 'orange', fontSize: 2 + 'vw' }">
                >>> </div>
            <div class="sequence-editors">
                <SequenceContainer :title="upTitle" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.upperSequence" :symbols="symbols" :variables="variables" :borderColor="borderColor"
                    @click="upperSeqSelected = true" @symbolClicked="removeFromUpperSeq" />
                <SequenceContainer :title="lowTitle" :width=30 :height=15 :maxFill="0.6" :maxSymbolWidthRatio="0.2"
                    :sequence="axiom?.lowerSequence" :symbols="symbols" :variables="variables" :borderColor="borderColor"
                    @click="upperSeqSelected = false" @symbolClicked="removeFromLowerSeq" />
            </div>
            <SymbolList :symbols="symbols" :type="SymbolType.TERMINAL"
                :showVarTags="variables !== undefined && variables.length > 0"
                @addSymbol="(symbol) => emit('addSymbol', symbol)" @deleteSymbol="(symbol) => deleteSymbol(symbol)"
                @symbolClicked="(symbol) => addSymbolToSequence(symbol)"
                @toggleVarTarget="(symbol) => emit('toggleVarTarget', symbol)" />
            <SymbolList :symbols="variables" :type="SymbolType.VARIABLE" :showVarTags="false"
                @addSymbol="(symbol) => emit('addSymbol', symbol)" @deleteSymbol="(symbol) => deleteSymbol(symbol)"
                @symbolClicked="(symbol) => addSymbolToSequence(symbol)" />
        </div>
        <div class="button-container">
            <div class="axiom-cancel-button" @click="emit('close')"> Abbrechen </div>
            <div v-if="axiomValid(axiom)" class="axiom-save-button" @click="confirm"> Speichern </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolPointer, SymbolData, SymbolType } from '@/scripts/Interfaces';
import { defineProps, defineEmits, Ref, ref, withDefaults } from 'vue';
import SymbolList from '../axiom/SymbolList.vue'
import SequenceContainer from '@/components/axiom/SequenceContainer.vue';
import { axiomValid } from '@/scripts/AxiomMethods';

interface Props {
    axiom: AxiomData | undefined;
    symbols: SymbolData[] | undefined;
    variables: SymbolData[] | undefined;
    upTitle: string;
    lowTitle: string;
    borderColor: string;
}

const props = withDefaults(defineProps<Props>(), {
    axiom: () => ({ upperSequence: [], lowerSequence: [] })
});
const emit = defineEmits(['addSymbol', 'deleteSymbol', 'saveAxiom', 'close', 'toggleVarTarget']);

const upperSeqSelected: Ref<boolean> = ref(true);
const axiom: Ref<AxiomData> = ref({
    upperSequence: props.axiom ? [...props.axiom.upperSequence] : [],
    lowerSequence: props.axiom ? [...props.axiom.lowerSequence] : []
});

function deleteSymbol(symbolPointer: SymbolPointer) {
    axiom.value.upperSequence = [];
    axiom.value.lowerSequence = [];
    emit('deleteSymbol', symbolPointer);
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

function confirm(): void {
    emit('saveAxiom', axiom.value);
    emit('close');
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
    z-index: 250;
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