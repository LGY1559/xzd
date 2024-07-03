<script setup>
import { ref, onMounted, watch } from 'vue'
import { getAll } from '../api/index.js'
import { useWeatherStore } from '../stores/weather'
import Cityfind from '../components/CityFind.vue'
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

const weekToChinese = (week) => {
  const weekMap = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '日'
  }
  return weekMap[week] || week
}

const options = ref({
  grid: {
    left: 0,
    right: 0,
    top: 50,
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    show: false,
    max: 40,
    min: 20
  },
  series: [
    {
      data: hightemp,
      type: 'line',
      smooth: true,
      label: {
        show: true,
        position: "top",
        color: "#fff",
        formatter: function (params) {
          return "白" + params.value + "℃";
        },
      },
    },
    {
      data: lowtemp,
      type: "line",
      smooth: true,
      label: {
        show: true,
        position: "bottom",
        color: "#fff",
        formatter: function (params) {
          return "晚" + params.value + "℃";
        },
      },
    },
  ]
})
</script>

<template>
    <Cityfind/>
  <h2 class="text-white">近期天气</h2>
    <div class="weather text-center text-white">
      <div class="days">
        <ul>
          <li>今天</li>
          <li> {{ day0.date ? day0.date.slice(-5) : '' }}</li>
          <li> {{ day0.dayweather }}</li>
          <li>风力{{ day0.daypower }}级</li>
        </ul>
        <ul>
          <li>明天</li>
          <li> {{ day1.date ? day1.date.slice(-5) : '' }}</li>
          <li> {{ day1.dayweather }}</li>
          <li>风力{{ day1.daypower }}级</li>
        </ul>
        <ul>
          <li>周{{ weekToChinese(day2.week) }}</li>
          <li> {{ day2.date ? day2.date.slice(-5) : '' }}</li>
          <li>{{ day2.dayweather }}</li>
          <li>风力{{ day2.daypower }}级</li>
        </ul>
        <ul>
          <li>周{{ weekToChinese(day3.week) }}</li>
          <li>{{ day3.date ? day3.date.slice(-5) : '' }}</li>
          <li>{{ day3.dayweather }}</li>
          <li>风力{{ day3.daypower }}级</li>
        </ul>
      </div>
      <v-chart :option="options" style="width: 100%;height: 150px;margin: 2rem 0 0 0;" />
    </div>
</template>

<style scoped>
.weather {
  padding: 2rem;
  margin-top: 0.5rem;
  background-color: rgb(0 78 113);
}
ul{
  width: 25%;
}
.days{
  display: flex;
}
li{
  height: 2.5rem;
}
</style>
