<template>
  <div class="text-white">
    <input type="text" placeholder="请输入城市名称" v-model="inputCity" @input="handleInput"/>
    <div class="scarch" v-if="showSearchResults">
      <p v-if="searchResults.length === 0">似乎没有找到你查找的城市</p>
      <p v-else v-for="result in searchResults" :key="result.id" @click="handleCityClick(result)">{{ result.name }}</p>
      <p v-if="networkError">网络似乎有点问题，请尝试重新输入</p>
    </div>
    <!-- <h2 class="text-center" style="margin:2rem;">
      暂时没有保存过城市天气信息，请查询后点击右上角“+”号保存
    </h2> -->
    <div class="tip">西安市（显示存储的城市） </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCity } from '../api/index.js'

const inputCity = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const networkError = ref(false)
const router = useRouter()

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
      networkError.value = true
    }
  } else {
    searchResults.value = []
    showSearchResults.value = false
    networkError.value = false
  }
}

const handleCityClick = (result) => {
  console.log('Adcode:', result.adcode)
  router.push({
    name: 'weather',
    params: { adcode: result.adcode },
    query: { name: result.name }
  })
}
</script>

<style scoped>
input {
  width: 100%;
  height: 2rem;
  background-color: rgb(0 102 138);
  border-bottom: 1px solid white;
  outline: none;
  color: white;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
}

input:focus {
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-bottom: none;
}

.scarch {
  background-color: rgb(0 78 113);
  line-height: 3rem;
}
.tip{
  background-color:  rgb(0 78 113);
  height: 3rem;
  line-height: 3rem;
  padding-left: 1rem;
  margin: 1rem 0;
}
</style>
