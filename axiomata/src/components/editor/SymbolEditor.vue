<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div>
      <div class="title-container">
        <div class="edit-symbol-title"> Neues Symbol erstellen </div>
      </div>
      <div class="flex-container">
        <ColorEditor title="Hintergrundfarbe" :defaultValue=255 @changeColor="setBackgroundColor" />
        <div class="edit-symbol" :style="{ background: backgroundColor, color: textColor }"
          @click="emit('editSymbolText')">
          {{ text }}
        </div>
        <ColorEditor title="Textfarbe" :defaultValue=0 @changeColor="setTextColor" />
      </div>
      <div class="button-container">
        <div class="cancel-button" @click="emit('closeSymbolEditor')"> abbrechen </div>
        <div class="ok-symbol-button" @click="addNewSymbol"> ok </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChapterData, SymbolData } from '@/scripts/Interfaces';
import { Ref, ref, defineEmits, defineProps } from 'vue';
import ColorEditor from './ColorEditor.vue';
import axios from 'axios';

interface Props {
  editID: any
  text: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['editSymbolText', 'closeSymbolEditor', 'updateSymbols']);

const backgroundColor: Ref<string> = ref('white');
const textColor: Ref<string> = ref('black');

function setBackgroundColor(color: string) {
  backgroundColor.value = color;
}

function setTextColor(color: string) {
  textColor.value = color;
}

async function addNewSymbol(): Promise<void> {
  try {
    const newSymbol: SymbolData = {
      backgroundColor: backgroundColor.value,
      text: props.text,
      textColor: textColor.value
    }
    const updateData = {
      editID: props.editID,
      newSymbol: newSymbol
    }
    const response = await axios.post('http://localhost:3000/addNewSymbol', updateData);
    if (response.status === 200) {
      const updatedSymbols: ChapterData[] = response.data.symbols;
      emit('updateSymbols', updatedSymbols);
      emit('closeSymbolEditor');
      console.log('New symbol added successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error adding new chapter:', error);
  }
}
</script>

<style>
.backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 50%;
}

.edit-symbol-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}

.title-container {
  display: grid;
  place-items: center;
}

.edit-symbol-title {
  margin-bottom: 0;
  font-size: 5vh;
  background: orange;
  width: 30vw;
  display: grid;
  place-items: center;
  border-radius: 2vw;
}

.flex-container {
  display: flex;
  justify-content: center;
  background-color: rgb(192, 191, 191);
  border-radius: 20vw;
}

.edit-symbol {
  width: 20vw;
  height: 20vw;
  border: 1vw solid black;
  border-radius: 5vw;
  display: grid;
  place-items: center;
  font-size: 10vh;
  user-select: none;
}

.button-container {
  display: flex;
  place-items: center;
  justify-content: center;
}

.cancel-button {
  width: 10vw;
  height: 5vh;
  background-color: red;
  display: grid;
  place-items: center;
  user-select: none;
}

.ok-symbol-button {
  width: 10vw;
  height: 5vh;
  background-color: green;
  display: grid;
  place-items: center;
  user-select: none;
}
</style>
