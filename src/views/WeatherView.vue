<template>
  <p class="text-center text-white title">你正在预览{{ cityName }}的天气信息，可以通过右上角"+"号保存起来</p>
  <i v-if="!isCityAlreadySaved" class="iconfont icon-tianjia add " @click="saveToLocalStorage"></i>
  <div class="text-white" style="margin-top: 3rem;">
    <div class="text-center">
      <p style="margin-bottom: 1rem;">当日气温是：{{ nowtemp }}摄氏度</p>
      <p style="margin-bottom: 1rem;">当日天气是：{{ nowweather }}</p>
      <p style="margin-bottom: 1rem;">当日风向是：{{ nowwind }}</p>
      <p style="margin-bottom: 1rem;">当日风力是：{{ nowpower }}</p>
    </div>
    <WeatherDisplay
      :day0="day0"
      :day1="day1"
      :day2="day2"
      :day3="day3"
      :hightemp="hightemp"
      :lowtemp="lowtemp"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAll, getNow } from '../api/index.js'
import WeatherDisplay from '../components/WeatherDisplay.vue'

const route = useRoute()
const adcode = ref(route.params.adcode)
const cityName = route.query.name
const day0 = ref({})
const day1 = ref({})
const day2 = ref({})
const day3 = ref({})
const hightemp = ref([])
const lowtemp = ref([])
const nowtemp = ref('')
const nowweather = ref('')
const nowwind = ref('')
const nowpower = ref('')
const isCityAlreadySaved = ref(false)

onMounted(() => {
  if (adcode.value) {
    checkIfCityAlreadySaved()
    fetchWeatherData()
    getNowWeather()
  }
})

const checkIfCityAlreadySaved = () => {
  const existingWeatherData = JSON.parse(localStorage.getItem('weatherData')) || []
  const isSaved = existingWeatherData.some(data => data.adcode === adcode.value)
  isCityAlreadySaved.value = isSaved
}

const getNowWeather = async () => {
  try {
    const res = await getNow(adcode.value)
    const now = res.data
    nowtemp.value = now.lives[0].temperature // 设置 nowtemp 的值
    nowweather.value = now.lives[0].weather
    nowwind.value = now.lives[0].winddirection
    nowpower.value = now.lives[0].windpower
    console.log(now)
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

const fetchWeatherData = async () => {
  try {
    const res = await getAll(adcode.value)
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

const saveToLocalStorage = () => {
  const weatherData = {
    cityName: cityName,
    adcode: adcode.value, // 添加 adcode
    nowtemp: nowtemp.value,
    nowweather: nowweather.value,
    nowwind: nowwind.value,
    nowpower: nowpower.value
  }

  // 从 localStorage 中读取已有的天气数据数组，如果没有则创建一个新的数组
  const existingWeatherData = JSON.parse(localStorage.getItem('weatherData')) || [];

  // 将新的天气数据添加到数组中
  existingWeatherData.push(weatherData);

  // 将更新后的数组保存回 localStorage
  localStorage.setItem('weatherData', JSON.stringify(existingWeatherData));

  alert('天气数据已保存');
  isCityAlreadySaved.value = true
}
</script>

<style scoped lang="scss">
.add{
  position: absolute;
  top: 1.5rem;
  right: 17%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
.title {
  background-color: rgb(0 78 113);
  width: 100%;
  position: absolute;
  top: 5.2rem;
  right: 0;
  height: 2.5rem;
  line-height: 2.5rem;
  z-index: 1000;
}

@media (max-width: 640px) {
  .title {
    top: 8rem; /* 当屏幕宽度小于640px时，margin-top改为7rem */
  }
}
</style>