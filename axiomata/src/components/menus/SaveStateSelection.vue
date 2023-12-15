<template>
  <HomeButton @click="emit('openHomeScreen')" />
  <div class="savestate-list">
    <transition-group name="savestate-list" tag="div">
      <div class="flex-box" v-for="header in saveStateHeaders" :key="header.saveID">
        <div class="savestate-container" @click="emit('openCourse', header.saveID)">
          <AxiomContainer class="header-axiom" :width=10 :height=10 :axiom="header.coverAxiom" :symbols="header.symbols"
            :variables="header.variables" background="white" borderColor="rgb(70, 179, 215)" />
          <div class="savestate-title"> {{ header.title }} </div>
          <div class="savestate-progression-display" :style="{ color: progressionColor(header) }"> Levels gelöst: <br> {{
            header.solvedLevels }} / {{ header.totalLevels }}</div>
        </div>
        <TextButton text="Löschen" @click.stop="deleteSaveState(header.saveID)" />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import HomeButton from './HomeButton.vue';
import { AxiomData, SymbolData } from '@/scripts/Interfaces';
import AxiomContainer from '../axiom/AxiomContainer.vue';
import TextButton from './TextButton.vue';

interface Props {
  userName: string;
}

const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);

interface SaveStateHeader {
  saveID: any;
  title: string;
  solvedLevels: number;
  totalLevels: number;
  coverAxiom: AxiomData;
  symbols: SymbolData[];
  variables: SymbolData[];
}

const saveStateHeaders: Ref<SaveStateHeader[]> = ref([]);

onMounted(() => {
  fetchCourseSaves();
});

const emit = defineEmits(['openCourse', 'openHomeScreen']);

async function fetchCourseSaves(): Promise<void> {
  try {
    const query: string = '?userName=' + userName.value;
    const response = await axios.get('http://localhost:3000/saveStateHeaders' + query);
    if (response.status === 200) {
      saveStateHeaders.value = response.data.saveStateHeaders;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function deleteSaveState(saveID: any): Promise<void> {
  try {
    const data = { saveID: saveID, userName: props.userName }
    const response = await axios.patch('http://localhost:3000/deleteSaveState', data);
    if (response.status === 200) {
      saveStateHeaders.value = response.data.saveStateHeaders;
      console.log('saveState deleted successfully');
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error patching data:', error);
  }
}

function progressionColor(header: SaveStateHeader): string {
  return header.solvedLevels === header.totalLevels ? 'rgb(70, 179, 215)' : 'rgb(120, 120, 120)';
}
</script>

<style>
.savestate-list {
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

.savestate-container {
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

.savestate-container:hover {
  opacity: 100%;
  transform: scale(1.04);
}

.savestate-title {
  user-select: none;
  font-size: 3vw;
  flex: 2;
  padding-left: 4vw;
  color: rgb(44, 44, 44);
  ;
}

.savestate-progression-display {
  user-select: none;
  font-size: 1vw;
  margin-left: 9vw;
  text-align: center;
  flex: 1;
  padding-right: 2vw;
}

.header-axiom {
  flex: 1;
}

.savestate-list-enter-active,
.savestate-list-leave-active {
  transition: all 0.5s ease;
}

.savestate-list-enter,
.savestate-list-leave-to {
  opacity: 0;
  transform: translateX(-10vw);
}

.savestate-list-move {
  transition: transform 0.5s ease;
  transition-delay: 0.3s;
}

.savestate-list-leave-active {
  position: absolute;
}</style>