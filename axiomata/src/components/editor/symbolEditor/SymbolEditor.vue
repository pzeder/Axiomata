<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div>
      <div class="title-container">
        <div class="edit-symbol-title"> Neues Symbol erstellen </div>
      </div>
      <div class="flex-container">
        <ColorEditor title="Hintergrundfarbe" :defaultValue=255 @changeColor="setBackgroundColor" />
        <div class="middle">
          <SymbolComp :symbolWidth=20 :symbol="editSymbol" @click="emit('editSymbolText')" />
          <div class="font-size-title"> Schriftgrösse </div>
          <ValueSlider :minValue=1 :defaultValue=35 :maxValue=100 @changeValue="setFontSize" />
        </div>
        <ColorEditor title="Schriftfarbe" :defaultValue=0 @changeColor="setTextColor" />
      </div>
      <div class="button-container">
        <div class="cancel-button" @click="emit('closeSymbolEditor')"> abbrechen </div>
        <div class="ok-symbol-button" @click="addNewSymbol"> ok </div>
      </div>
    </div>
  </div>
  <TextInput v-if="showTextInput" title="Symboltext ändern" :placeholder="editSymbol.text" @updateText="setText"
    @click="showTextInput = false" />
</template>

<script setup lang="ts">
import { ChapterData, SymbolData } from '@/scripts/Interfaces';
import { Ref, ref, defineEmits, defineProps } from 'vue';
import ColorEditor from './ColorEditor.vue';
import axios from 'axios';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import ValueSlider from './ValueSlider.vue';

interface Props {
  editID: any
}

const props = defineProps<Props>();

const emit = defineEmits(['editSymbolText', 'closeSymbolEditor', 'updateSymbols']);
const showTextInput: Ref<boolean> = ref(false);

const editSymbol: Ref<SymbolData> = ref({
  backgroundColor: '',
  text: 'text',
  textColor: '',
  fontSize: 35
});

function setBackgroundColor(color: string) {
  editSymbol.value.backgroundColor = color;
}

function setText(text: string): void {
  editSymbol.value.text = text;
}

function setTextColor(color: string) {
  editSymbol.value.textColor = color;
}

function setFontSize(fontSize: number) {
  editSymbol.value.fontSize = fontSize;
}

async function addNewSymbol(): Promise<void> {
  try {
    const updateData = {
      editID: props.editID,
      newSymbol: editSymbol.value
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
  width: 100%;
  display: grid;
  place-items: center;
  border-radius: 2vw;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.flex-container {
  display: flex;
  justify-content: center;
  gap: 2vw;
  background-color: rgb(192, 191, 191);
  border-radius: 1vw;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 2vw;
}

.middle {
  display: grid;
  place-items: center;
}

.font-size-title {
  margin-top: 2vw;
  margin-bottom: 1vw;
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
  font-size: 1.5vw;
}

.ok-symbol-button {
  width: 10vw;
  height: 5vh;
  background-color: green;
  display: grid;
  place-items: center;
  user-select: none;
  font-size: 1.5vw;
}
</style>
