<template>
  <Cityfind/>
  <h2 class="text-white" style="margin: 1rem 0 0 0;">近期天气</h2>
  <WeatherDisplay
    :day0="weatherStore.day0"
    :day1="weatherStore.day1"
    :day2="weatherStore.day2"
    :day3="weatherStore.day3"
    :hightemp="weatherStore.hightemp"
    :lowtemp="weatherStore.lowtemp"
  />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useWeatherStore } from '../stores/weather'
import Cityfind from '../components/CityFind.vue'
import WeatherDisplay from '../components/WeatherDisplay.vue'

const weatherStore = useWeatherStore()

// 监听 cityid 的变化
watch(
  () => weatherStore.cityid,
  () => {
    weatherStore.fetchWeatherData()
  }
)

onMounted(() => {
  if (weatherStore.cityid) {
    weatherStore.fetchWeatherData()
  }
})
</script>