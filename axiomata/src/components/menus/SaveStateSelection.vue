<template>
  <HomeButton @click="emit('openStartMenu')" />
  <div class="savestate-list">
    <div class="flex-box" v-for="(header, index) in saveStateHeaders" :key="index">
      <div class="savestate-container" @click="emit('openCourse', header.saveID)">
        <div class="savestate-title"> {{ header.title }} </div>
      </div>
      <div class="savestate-delete-button" @click.stop="deleteSaveState(header)"> Löschen </div>
    </div>
  </div>
  <button @click="emit('openNewCourseMenu')"> Neuer Kurs </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import HomeButton from './HomeButton.vue';

interface Props {
  userName: string;
}

const props = defineProps<Props>();
const userName: Ref<string> = ref(props.userName);

interface SaveStateHeader {
  saveID: any;
  title: string;
}

const saveStateHeaders: Ref<SaveStateHeader[]> = ref([]);

onMounted(() => {
  fetchCourseSaves();
});

const emit = defineEmits(['openCourse', 'openNewCourseMenu', 'openStartMenu']);

async function fetchCourseSaves(): Promise<void> {
  try {
    const query: string = '?userName=' + userName.value;
    const response = await axios.get('http://localhost:3000/saveStateHeaders' + query);
    if (response.status === 200) {
      saveStateHeaders.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function deleteSaveState(header: SaveStateHeader): Promise<void> {
  try {
    const data = { saveID: header.saveID, userName: props.userName }
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
</script>

<style>
.savestate-list {
  display: grid;
  place-items: center;
  width: 100vw;
  margin-left: -4vw;
}

.flex-box {
  display: flex;
  align-items: center;
}

.savestate-container {
  width: 60vw;
  border: 1vw solid rgb(44, 44, 44);
  border-radius: 2vw;
  display: flex;
  justify-content: center;
  font-size: 4vw;
  color: rgb(44, 44, 44);
  padding: 3vw;
  background: lightblue;
}

.savestate-title {
  user-select: none;
}

.savestate-delete-button {
  display: grid;
  place-items: center;
  font-size: 2vw;
  padding: 2vw;
  background: red;
  border: 0.3vw solid rgb(44, 44, 44);
  border-radius: 1vw;
  user-select: none;
}
</style>