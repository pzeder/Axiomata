<template>
  <div class="edit-container" v-for="(edit, index) in edits" :key="index"> {{ edit.name }} </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, onMounted } from 'vue';

interface EditHeader {
  _id: any;
  name: string;
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
}
</style>