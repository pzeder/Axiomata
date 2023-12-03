<template>
  <HomeButton @click="emit('openStartMenu')" />
  <div class="save-container">
    <button v-for="ssh in saveStateHeaders" :key="ssh.saveID" @click="emit('openCourse', ssh.saveID)"> {{ ssh.title
    }} </button>
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
</script>

<style>
.save-container {
  display: flex;
  flex-direction: column;
}

.save-container button {
  margin-bottom: 10px;
  font-size: 40pt;
}
</style>