<template>
  <div class="sidebar-left">
    <HomeButton @click="emit('openHomeScreen')" />
    <div class="new-edit-button" @click="createNewEdit"> Neuen Kurs erstellen </div>
  </div>
  <div class="edit-list">
    <transition-group name="edit-list" tag="div">
      <div class="flex-box" v-for="header in editHeaders" :key="header.editID">
        <div class="edit-container" @click="emit('openEditor', header.editID)">
          <AxiomContainer class="header-axiom" :width=10 :height=10 :axiom="header.coverAxiom" :symbols="header.symbols"
            :variables="header.variables" background="white" borderColor="rgb(70, 179, 215)" />
          <div class="edit-title"> {{ header.title }} </div>
        </div>
        <TextButton text="Löschen" @click.stop="deleteEdit(header.editID)" />
      </div>
    </transition-group>
  </div>T
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, onMounted, defineProps, defineEmits } from 'vue';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import HomeButton from './HomeButton.vue';
import TextButton from '../UI/TextButton.vue';

interface Props {
  userName: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['openEditor', 'openHomeScreen']);

interface EditHeader {
  editID: any;
  title: string;
  coverAxiom: AxiomData | null;
  symbols: SymbolData[];
  variables: SymbolData[];
}

const editHeaders: Ref<EditHeader[]> = ref([]);

onMounted(() => {
  fetchEditHeaders();
});

async function fetchEditHeaders(): Promise<void> {
  try {
    const query = '?userName=' + props.userName;
    const response = await axios.get('http://localhost:3000/edits' + query);
    if (response.status === 200) {
      editHeaders.value = response.data.editHeaders;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function createNewEdit() {
  try {
    const data = ({
      userName: props.userName,
    });
    const response = await axios.post('http://localhost:3000/newEdit', data);
    if (response.status === 200) {
      emit('openEditor', response.data.editID);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function deleteEdit(editID: any): Promise<void> {
  try {
    const data = { editID: editID }
    const response = await axios.patch('http://localhost:3000/deleteEdit', data);
    if (response.status === 200) {
      editHeaders.value = response.data.editHeaders;
      console.log('edit deleted successfully');
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error patching data:', error);
  }
}
</script>

<style>
.sidebar-left {
  position: fixed;
  left: 2vw;
  top: 2vw;
  display: grid;
  place-items: left;
}

.new-edit-button {
  display: grid;
  place-items: center;
  text-align: center;
  font-size: 1vw;
  width: 7vw;
  height: 5vw;
  ;
  color: rgb(44, 44, 44);
  user-select: none;
  border: 0.4vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  background: lightgreen;
  transform: scale(1);
  opacity: 90%;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.new-edit-button:hover {
  transform: scale(1.1);
  opacity: 100%;
}

.edit-list {
  display: grid;
  place-items: center;
  width: 100vw;
  margin-left: -2vw;
  margin-top: 5vw;
}

.flex-box {
  display: flex;
  align-items: center;
}

.edit-container {
  width: 60vw;
  border: 0.7vw solid rgb(44, 44, 44);
  border-radius: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: lightblue;
  margin-bottom: 1vw;
  opacity: 85%;
  transform: scale(1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.edit-container:hover {
  opacity: 100%;
  transform: scale(1.04);
}

.edit-title {
  user-select: none;
  font-size: 3vw;
  flex: 3;
  padding-left: 4vw;
  color: rgb(44, 44, 44);
  ;
}

.header-axiom {
  flex: 1;
}

.edit-list-enter-active,
.edit-list-leave-active {
  transition: all 0.5s ease;
}

.edit-list-enter,
.edit-list-leave-to {
  opacity: 0;
  transform: translateX(-10vw);
}

.edit-list-move {
  transition: transform 0.5s ease;
  transition-delay: 0.3s;
}

.edit-list-leave-active {
  position: absolute;
}</style>