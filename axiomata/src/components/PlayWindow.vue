<template>
    <div> play <b> {{ selectedLevel }} </b> here ... </div>
</template>

<script setup lang=ts>
import { Ref, ref, defineProps } from 'vue';

interface Props {
  selectedLevel: string;
}

const props = defineProps<Props>();
const selectedCourse: Ref<string> = ref(props.selectedLevel);

</script>