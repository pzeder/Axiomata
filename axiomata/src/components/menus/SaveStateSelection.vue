<template>
  <div class="save-container">
    <button v-for="ssh in saveStateHeaders" :key="ssh.saveID" @click="saveStateSelected(ssh.saveID)"> {{ ssh.courseName
    }} </button>
  </div>
  <button @click="openNewCourseMenu"> Neuer Kurs </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { SessionState } from '@/scripts/Interfaces';

interface Props {
  sessionState: SessionState;
}

const props = defineProps<Props>();
const sessionState: Ref<SessionState> = ref(props.sessionState);

interface SaveStateHeader {
  saveID: any;
  courseName: string;
}

const saveStateHeaders: Ref<SaveStateHeader[]> = ref([]);

onMounted(() => {
  fetchCourseSaves();
});

const emit = defineEmits(['saveStateSelected', 'openNewCourseMenu', 'openStartMenu']);

function saveStateSelected(newSaveID: any) {
  emit('saveStateSelected', newSaveID);
}

function openNewCourseMenu() {
  emit('openNewCourseMenu');
}

function openStartMenu() {
  emit('openStartMenu');
}

async function fetchCourseSaves(): Promise<void> {
  try {
    const query: string = '?userName=' + sessionState.value.userName;
    const response = await axios.get('http://localhost:3000/saveStateHeaders' + query);
    if (response.status === 200) {
      saveStateHeaders.value = [];
      saveStateHeaders.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.save-container {
  display: flex;
  flex-direction: column;
}

.save-container button {
  margin-bottom: 10px;
}
</style>