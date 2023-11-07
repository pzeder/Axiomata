<template>
  <div class="save-container">
    <button v-for="state in saveStates" :key="state._id" @click="handleButtonClick(state._id)"> {{ state.courseName
    }} </button>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { UserState, CourseSave } from '@/scripts/Interfaces';

interface Props {
  userState: UserState;
}

const props = defineProps<Props>();
const userState: Ref<UserState> = ref(props.userState);

const saveStates: Ref<CourseSave[]> = ref([]);

onMounted(() => {
  console.log('fetching...');
  fetchCourseSaves();
  console.log(saveStates.value);
});

const emit = defineEmits(['saveStateSelected']);

function handleButtonClick(courseName: string) {
  emit('saveStateSelected', userState.value.saveID);
}

async function fetchCourseSaves(): Promise<void> {
  try {
    console.log(userState.value.userName);
    const response = await axios.get('http://localhost:3000/saveStates?userName=' + userState.value.userName);
    if (response.status === 200) {
      saveStates.value = [];
      saveStates.value = response.data;
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