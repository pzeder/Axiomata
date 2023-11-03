<template>
  <button v-for="c in courses"> {{ c }} </button>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import DB from '@/scripts/DB';

const courses: Ref<string[]> = ref(["nix"]);

onMounted(() => {
  fetchData();
});

async function fetchData(): Promise<void> {
  try {
    courses.value = [];
    courses.value = await DB.fetchData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>