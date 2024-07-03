<template>
  <p class="text-center text-white title">你正在预览{{ cityName }}的天气</p>
  <div class="text-white citytem">
    <div class="text-center">
      <p>当日气温是：{{ nowtemp }}摄氏度</p>
      <p>当日天气是：{{ nowweather }}</p>
      <p>当日风向是：{{ nowwind }}</p>
      <p>当日风力是：{{ nowpower }}</p>
    </div>
    <div class="weather text-center text-white">
      <div class="flex">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAll, getNow } from '../api/index.js'

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
const nowweather= ref('')
const nowwind = ref('')
const nowpower = ref('')

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

onMounted(() => {
  if (adcode.value) {
    fetchWeatherData()
    getNowWeather()
  }
})

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
    min: 15
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

<style scoped>
.title {
  background-color: rgb(0 78 113);
  width: 100%;
  position: absolute;
  top: 5.2rem;
  left: 0;
  right: 0;
  height: 2.5rem;
  line-height: 2.5rem;
}
.citytem {
  margin-top: 3rem;
}
.weather {
  margin-top: 2rem;
  padding: 2rem;
  background-color: rgb(0 78 113);
}
ul{
  width: 25%;
}
li{
  height: 2.5rem;
}
p{
  margin-bottom: 1rem;
}
</style>
