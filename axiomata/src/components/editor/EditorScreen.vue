<template>
  <div> {{ title }} </div>
  <ChapterList />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref, defineProps, onMounted } from 'vue';
import ChapterList from '@/components/editor/ChapterList.vue';

interface Props {
  editID: any;
}

const title: Ref<string> = ref('');

const props = defineProps<Props>();

onMounted(() => {
  fetchEdit();
});

async function fetchEdit(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/edit' + query);
    if (response.status === 200) {
      title.value = response.data.title;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>