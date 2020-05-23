<template>
  <div id="app">
    <EZUIKitJs />
  </div>
</template>

<script>
import EZUIKitJs from './components/EZUIKitJs.vue'

export default {
  name: 'App',
  components: {
    EZUIKitJs
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
