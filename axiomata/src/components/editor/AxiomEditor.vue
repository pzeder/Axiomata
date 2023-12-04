<template>
    <div class="backdrop"/>
    <div class="axiom-editor-screen">
        <div class="axiom-editor">
            <div class="sequence-editors"> 
                <SequenceContainer />   
                <SequenceContainer /> 
            </div>
            <SymbolBar :symbols="symbols" @openSymbolEditor="emit('openSymbolEditor')" @deleteSymbol="emit('deleteSymbol')"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SymbolData } from '@/scripts/Interfaces';
import { defineProps, defineEmits } from 'vue';
import SymbolBar from './SymbolBar.vue'
import SequenceContainer from '../axiom/SequenceContainer.vue';

interface Props {
    symbols: SymbolData[] | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits(['openSymbolEditor', 'deleteSymbol']);
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
</style>