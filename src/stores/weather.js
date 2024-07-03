import { ref,onMounted } from 'vue'
import { defineStore } from 'pinia'
import { getIpCity } from '@/api/index.js'
export const useWeatherStore = defineStore('weather', () => {
  const cityid = ref(0)
  onMounted(async () => {
    const res = await getIpCity()
    cityid.value = res.data.adcode
  })
  return { cityid }
})
