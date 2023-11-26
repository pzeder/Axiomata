<template>
  <div class="edit-container" v-for="(edit, index) in edits" :key="index"> {{ edit.title }} </div>
  <div class="new-edit-button" @click="createNewEdit"> Neuen Kurs erstellen </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, onMounted, defineProps, defineEmits } from 'vue';

interface Props {
  userName: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['newEditCreated']);

interface EditHeader {
  _id: any;
  title: string;
}

const edits: Ref<EditHeader[]> = ref([]);

onMounted(() => {
  fetchEditHeaders();
});

async function fetchEditHeaders(): Promise<void> {
  try {
    const response = await axios.get('http://localhost:3000/edits');
    if (response.status === 200) {
      edits.value = [];
      edits.value = response.data;
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
      emit('newEditCreated', response.data.editID);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.edit-container {
  width: 100vw;
  height: 10vh;
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 10px;
  text-align: center;
  font-size: 40pt;
  user-select: none;
}

.new-edit-button {
  width: 50vw;
  height: 10vh;
  border: 2px solid black;
  border-radius: 5vw;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20pt;
  user-select: none;
}
</style>