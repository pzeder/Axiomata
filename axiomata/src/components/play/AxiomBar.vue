<template>
  <div class="axiom-bar"
    :style="{ left: posX + 'vw', top: posY + 'vh', width: width + 'vw', height: height + 'vh', backgroundColor: background }">
    <div class="axiom-bar-title" :style="{
      width: width + 'vw',
      height: titleHeight + 'vh'
    }"> {{ title }} </div>
    <AxiomContainer v-for="(axiom, index) in axioms" :key="index" :index="index" :posX="containerX(index)"
      :posY="titleHeight + containerY(index)" :width="containerWidth" :height="containerHeight" :screenRatio="screenRatio"
      :axiom="axiom" :symbolAlphabet="symbolAlphabet" :variables="variables" :varColors="varColors"
      @selectAxiom="emit('selectAxiom', axiom)" />
  </div>
</template>

<script setup lang="ts">
import { AxiomData, SymbolData, VarData } from '@/scripts/Interfaces';
import { computed, defineProps, defineEmits, Ref, ref } from 'vue';
import AxiomContainer from '@/components/axiom/AxiomContainer.vue'

interface Props {
  title: string;
  background: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  screenRatio: number;
  axioms: AxiomData[];
  symbolAlphabet: SymbolData[];
  variables: VarData[];
  varColors: string[];
}
const props = defineProps<Props>();
const emit = defineEmits(['selectAxiom', 'mouseOver']);

const titleHeight: Ref<number> = ref(5);

const vertical = computed(() => props.width * props.screenRatio < props.height);
const maxContainerWidth = computed(() => vertical.value ? props.width : 0.5 * props.height);
const minContainerWidth = computed(() => vertical.value ? props.width : props.width / props.axioms.length)
const containerWidth = computed(() => Math.min(minContainerWidth.value, maxContainerWidth.value));
const maxContainerHeight = computed(() => vertical.value ? 0.5 * props.width * props.screenRatio : props.height);
const minContainerHeight = computed(() => vertical.value ? props.height / props.axioms.length : props.height);
const containerHeight = computed(() => Math.min(minContainerHeight.value, maxContainerHeight.value));
const containerX = (index: number) => vertical.value ? 0 : index * containerWidth.value;
const containerY = (index: number) => vertical.value ? index * containerHeight.value : 0;
</script>

<style>
.axiom-bar {
  position: absolute;
}

.axiom-bar-title {
  position: absolute;
  font-size: 4vh;
  color: black;
  left: 0;
  top: 0;
  user-select: none;
}
</style>