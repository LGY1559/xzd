<script setup>
import { RouterView } from 'vue-router'
import WeatherHead from './components/WeatherHead.vue'

</script>

<template>
    <WeatherHead class="head"/>
    <div>
      <RouterView/>
    </div>
</template>
<style  scoped>
.head{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

</style>