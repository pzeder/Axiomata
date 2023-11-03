<template>
  <CourseSelection />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CourseSelection from './components/CourseSelection.vue';

@Options({
  components: {
    CourseSelection,
  },
})
export default class App extends Vue { }
</script>
