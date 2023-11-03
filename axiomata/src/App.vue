<template>
  <CircleFactory msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CircleFactory from './components/CircleFactory.vue';

@Options({
  components: {
    CircleFactory,
  },
})
export default class App extends Vue { }
</script>
