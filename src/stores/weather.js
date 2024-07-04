import { ref, onMounted } from 'vue'
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
  const searchResults = ref([])
  const showSearchResults = ref(false)
  const networkError = ref(false)
  const savedCities = ref([])

  const fetchIpCity = async () => {
    const res = await getIpCity()
    cityid.value = res.data.adcode
    await fetchNowWeather()
    await fetchWeatherData()
  }

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

  const deleteCity = (index) => {
    savedCities.value.splice(index, 1)
    localStorage.setItem('weatherData', JSON.stringify(savedCities.value))
  }

  const loadSavedCities = () => {
    const savedCitiesData = localStorage.getItem('weatherData')
    if (savedCitiesData) {
      savedCities.value = JSON.parse(savedCitiesData)
    }
  }

  const clearInput = () => {
    inputCity.value = ''
    searchResults.value = []
    showSearchResults.value = false
  }

  onMounted(() => {
    fetchIpCity()
    loadSavedCities()
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