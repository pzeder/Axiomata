<template>
    <div class="play-container">
        <div> Du spielst gerade <b> {{ selectedLevel }} </b> </div>
        <button @click="easyWin"> klicke hier um zu gewinnen </button>
        <div v-if="hasWon" style="font-size: 100pt"> Wahnsinn! Du hast es geschafft! </div>
        <button @click="backToLevelMenu"> zurück zur Levelauswahl </button>
    </div>
</template>

<script setup lang=ts>
import { Ref, ref, defineProps, defineEmits } from 'vue';

interface Props {
  selectedLevel: string;
}

const props = defineProps<Props>();
const selectedCourse: Ref<string> = ref(props.selectedLevel);

const hasWon: Ref<boolean> = ref(false);

const emit = defineEmits(['backToLevelMenu']);

function easyWin(event: MouseEvent): void {
    hasWon.value = true;
}

function backToLevelMenu(event: MouseEvent): void {
    emit('backToLevelMenu');
}
</script>

<style>
.play-container {
  display: flex;
  flex-direction: column;
}

.play-container button {
  margin-bottom: 10px;
}
</style>