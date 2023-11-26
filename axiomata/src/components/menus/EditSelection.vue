<template>
  <div class="edit-container" v-for="(edit, index) in edits" :key="index"> {{ edit.name }} </div>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';

interface EditHeader {
  _id: any;
  name: string;
}

const edits: Ref<EditHeader[]> = ref([{ _id: 0, name: "fuck you" }, { _id: 0, name: "please" }]);

onMounted(() => {
  console.log("lol")
});
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