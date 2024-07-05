import { ref, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { getIpCity, getCity, getAll, getNow } from '@/api/index.js'

export const useWeatherStore = defineStore('weather', () => {
  const cityid = ref(0)
  const cityName = ref('')
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
  const inputCity = ref('')
  // 搜索结果
  const searchResults = ref([])
  // 是否显示搜索结果
  const showSearchResults = ref(false)
  // 网络错误状态
  const networkError = ref(false)
  // 已保存的城市列表
  const savedCities = ref([])
  // 获取IP定位城市信息
  const fetchIpCity = async () => {
    const res = await getIpCity()
    cityid.value = res.data.adcode
    await fetchNowWeather()
    await fetchWeatherData()
  }
  // 这段代码的主要功能是处理用户输入的城市名称，并根据输入内容从API获取相应的城市数据
  const handleInput = async () => {
    const city = inputCity.value
    if (city) {
      try {
        const response = await getCity(city)
        searchResults.value = response.data.geocodes.map((geo, index) => ({
          id: index,
          name: geo.city,
          adcode: geo.adcode
        }))
        showSearchResults.value = true
        networkError.value = false
      } catch (error) {
        console.error('Error fetching city data:', error)
        searchResults.value = []
        showSearchResults.value = true
        networkError.value = false
      }
    } else {
      searchResults.value = []
      showSearchResults.value = false
      networkError.value = false
    }
  }

  // 获取天气数据
  const fetchWeatherData = async () => {
    try {
      const res = await getAll(cityid.value)
      day0.value = res.data.forecasts[0].casts[0]
      day1.value = res.data.forecasts[0].casts[1]
      day2.value = res.data.forecasts[0].casts[2]
      day3.value = res.data.forecasts[0].casts[3]
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

  // 获取当前天气数据
  const fetchNowWeather = async () => {
    try {
      const res = await getNow(cityid.value)
      const now = res.data
      nowtemp.value = now.lives[0].temperature
      nowweather.value = now.lives[0].weather
      nowwind.value = now.lives[0].winddirection
      nowpower.value = now.lives[0].windpower
      cityName.value = now.lives[0].city
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  // 删除城市
  const deleteCity = (index) => {
    savedCities.value.splice(index, 1)
    localStorage.setItem('weatherData', JSON.stringify(savedCities.value))
  }

  // 加载已保存的城市
  const loadSavedCities = () => {
    const savedCitiesData = localStorage.getItem('weatherData')
    if (savedCitiesData) {
      savedCities.value = JSON.parse(savedCitiesData)
    }
  }

  // 清除输入
  const clearInput = () => {
    inputCity.value = ''
    searchResults.value = []
    showSearchResults.value = false
  }

  // 定时刷新 nowtemp
  const refreshNowTemp = () => {
    savedCities.value.forEach((city, index) => {
      updateNowTemp(city.adcode, index)
    })
  }

  // 更新 nowtemp
  const updateNowTemp = async (adcode, index) => {
    try {
      const response = await getNow(adcode)
      savedCities.value[index].nowtemp = response.data.lives[0].temperature
    } catch (error) {
      console.error('Failed to update nowtemp:', error)
    }
  }

  let timer = null

  // 组件挂载时执行
  onMounted(() => {
    fetchIpCity()
    loadSavedCities()
    refreshNowTemp() // 初始化时刷新一次
    timer = setInterval(refreshNowTemp, 3600000) // 每小时刷新一次
  })

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    cityid,
    cityName,
    day0,
    day1,
    day2,
    day3,
    hightemp,
    lowtemp,
    nowtemp,
    nowweather,
    nowwind,
    nowpower,
    inputCity,
    searchResults,
    showSearchResults,
    networkError,
    savedCities,
    fetchIpCity,
    handleInput,
    fetchWeatherData,
    fetchNowWeather,
    deleteCity,
    loadSavedCities,
    clearInput
  }
})