<template>
  <div> {{ name }} </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';
interface Props {
  name: string;
}
const props = defineProps<Props>();
const name: Ref<string> = ref(props.name);
</script>