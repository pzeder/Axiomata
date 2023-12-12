<template>
    <div class="screen-container">
        <div class="bonus-axiom-container" > 
            <div class="bonus-axiom-title"> Neue Bonus-Regel! </div>
            <AxiomContainer :width=20 :height=20 :axiom="level.goalAxiom" :symbols="symbols" :variables="variables"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import { LevelData, SymbolData } from '@/scripts/Interfaces';

interface Props {
    level: LevelData;
    symbols: SymbolData[];
    variables: SymbolData[];
}

const props = defineProps<Props>();
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
</style>