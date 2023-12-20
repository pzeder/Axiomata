<template>
  <div class="backdrop" />
  <div class="edit-symbol-container">
    <div class="symbol-editor-border">
      <div class="title-container">
        <div class="edit-symbol-title"> Symbol gestalten </div>
      </div>
      <div class="symbol-editor-window">
        <div class="flex-container">
          <ColorEditor title="Hintergrundfarbe" :color="editSymbol.backgroundColor" @changeColor="setBackgroundColor" />
          <div class="middle">
            <SymbolComp :symbolWidth=20 :symbol="editSymbol" @click="showTextInput = true" />
            <div class="font-size-title"> Schriftgrösse </div>
            <ValueSlider :minValue=1 :defaultValue="editSymbol.fontSize" :maxValue=100 @changeValue="setFontSize" />
          </div>
          <ColorEditor title="Schriftfarbe" :color="editSymbol.textColor" @changeColor="setTextColor" />
        </div>
        <div class="button-container">
          <TextButton text="Abbrechen" @click="emit('close')" />
          <TextButton text="Speichern" background="lightgreen" @click="confirm" />
        </div>
      </div>
    </div>
  </div>
  <TextInputWindow v-if="showTextInput" title="Symboltext ändern" :placeholder="editSymbol.text"
    @close="showTextInput = false" @updateText="setText" />
</template>

<script setup lang="ts">
import { ColorValue, SymbolData } from '@/scripts/Interfaces';
import { Ref, ref, defineEmits, defineProps } from 'vue';
import ColorEditor from './ColorEditor.vue';
import SymbolComp from '@/components/axiom/SymbolComp.vue';
import ValueSlider from '../UI/ValueSlider.vue';
import TextInputWindow from '../UI/TextInputWindow.vue';
import TextButton from '../UI/TextButton.vue';

interface Props {
  symbol: SymbolData;
}

const props = defineProps<Props>();
const emit = defineEmits(['updateSymbol', 'close']);
const showTextInput: Ref<boolean> = ref(false);

const editSymbol: Ref<SymbolData> = ref({
  backgroundColor: props.symbol.backgroundColor,
  text: props.symbol.text,
  textColor: props.symbol.textColor,
  fontSize: props.symbol.fontSize,
  type: props.symbol.type,
  varTarget: props.symbol.varTarget
});

function setBackgroundColor(color: ColorValue) {
  editSymbol.value.backgroundColor = color;
}

function setText(text: string): void {
  showTextInput.value = false;
  editSymbol.value.text = text;
}

function setTextColor(color: ColorValue) {
  editSymbol.value.textColor = color;
}

function setFontSize(fontSize: number) {
  editSymbol.value.fontSize = fontSize;
}

function confirm(): void {
  emit('updateSymbol', editSymbol.value);
  emit('close');
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
  z-index: 400;
}

.symbol-editor-border {
  border: 0.5vw solid rgb(44, 44, 44);
  border-radius: 1.5vw;
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
  border-radius: 1vw;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.symbol-editor-window {
  background-color: white;
  border-radius: 1vw;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 2vw;
}

.flex-container {
  display: flex;
  justify-content: center;
  gap: 2vw;
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
  gap: 1vw;
}
</style>
