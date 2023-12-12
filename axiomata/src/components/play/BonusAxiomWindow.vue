<template>
    <div class="screen-container">
        <div class="bonus-axiom-container" > 
            <div class="bonus-axiom-title"> Neue Bonus-Regel! </div>
            <AxiomContainer v-if="!bonusAxiomGrabed && !levelFinished" :width=20 :height=20 :axiom="level.goalAxiom" :symbols="symbols" :variables="variables" @selectAxiom="(event, axiom) => $emit('grabBonusAxiom', event, axiom)"/>
            <div class="bonus-placeholder" v-if="bonusAxiomGrabed || levelFinished" :style="{ width: 20 + 'vw', height: 20 + 'vw' }" >
                <div class="continue-button" v-if="levelFinished" @click="emit('finishLevel')"> Weiter </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import { LevelData, SymbolData } from '@/scripts/Interfaces';

interface Props {
    level: LevelData;
    symbols: SymbolData[];
    variables: SymbolData[];
    bonusAxiomGrabed: boolean;
    levelFinished: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['grabBonusAxiom', 'finishLevel']);
</script>

<style>
.screen-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.bonus-axiom-container {
  position: fixed;
  margin-top: -10vw;
  width: 30vw;
  border: 0.5vw solid black;
  border-radius: 1vw;
  background: orange;
  display: grid;
  place-items: center;
}

.bonus-axiom-title {
    font-size: 2vw;
    color: white;
    padding: 2vw;
}

.bonus-placeholder {
    display: grid;
    place-items: center;
}

.continue-button {
    display: grid;
    place-items: center;
    font-size: 1vw;
    color: black;
    background: rgb(89, 204, 245);
    padding: 1vw;
    border: 0.2vw solid black;
    border-radius: 1vw;
    user-select: none;
}
</style>