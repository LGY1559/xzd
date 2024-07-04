<template>
  <Cityfind/>
  <h2 class="text-white" style="margin: 1rem 0 0 0;">近期天气</h2>
  <WeatherDisplay
    :day0="day0"
    :day1="day1"
    :day2="day2"
    :day3="day3"
    :hightemp="hightemp"
    :lowtemp="lowtemp"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAll } from '../api/index.js'
import { useWeatherStore } from '../stores/weather'
import Cityfind from '../components/CityFind.vue'
import WeatherDisplay from '../components/WeatherDisplay.vue'

const weatherStore = useWeatherStore()
const cityid = ref(weatherStore.cityid)
const day0 = ref({})
const day1 = ref({})
const day2 = ref({})
const day3 = ref({})
const hightemp = ref([])
const lowtemp = ref([])

// 监听 cityid 的变化
watch(
  () => weatherStore.cityid,
  (newCityid) => {
    cityid.value = newCityid
    fetchWeatherData()
  }
)

const fetchWeatherData = async () => {
  try {
    const res = await getAll(cityid.value)
    // 根据返回的数据更新 options
    day0.value = res.data.forecasts[0].casts[0]
    day1.value = res.data.forecasts[0].casts[1]
    day2.value = res.data.forecasts[0].casts[2]
    day3.value = res.data.forecasts[0].casts[3]

    // 提取 daytemp 和 nighttemp 的值
    hightemp.value = [
      parseInt(day0.value.daytemp),
      parseInt(day1.value.daytemp),
      parseInt(day2.value.daytemp),
      parseInt(day3.value.daytemp)
    ]
    lowtemp.value = [
      parseInt(day0.value.nighttemp),
      parseInt(day1.value.nighttemp),
      parseInt(day2.value.nighttemp),
      parseInt(day3.value.nighttemp)
    ]
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

onMounted(() => {
  if (cityid.value) {
    fetchWeatherData()
  }
})
</script>
