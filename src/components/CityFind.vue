<template>
  <div class="text-white">
    <input type="text" placeholder="请输入城市名称" v-model="inputCity" @input="handleInput" />
    <div class="scarch" v-if="showSearchResults">
      <p v-if="searchResults.length === 0">似乎没有找到你查找的城市</p>
      <p v-else v-for="result in searchResults" :key="result.id" @click="handleCityClick(result)">{{ result.name }}</p>
      <p v-if="networkError">网络似乎有点问题，请尝试重新输入</p>
    </div>
    <div>
      <div v-if="savedCities.length > 0" class="city-list font-white gap-2">
        <div v-for="(city, index) in savedCities" :key="index" class="city-item">
          <div class="city-item-data">
            <span>{{ city.cityName }}</span>
            <span>{{ city.nowtemp }}℃</span>
          </div>
          <div class="city-item-btn">
            <button class="btn font-white" @click="viewCityWeather(city)">查看</button>
            <button class="btn font-white" @click="deleteCity(index)">删除</button>
          </div>
        </div>
      </div>
      <h2 v-else class="text-white text-center ">
        暂时没有保存过城市天气信息,请查询后点击左上角"+"号保存
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCity } from '../api/index.js'

const inputCity = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const networkError = ref(false)
const router = useRouter()
const savedCities = ref([])

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

const viewCityWeather = (city) => {
  router.push({
    name: 'weather',
    params: { adcode: city.adcode },
    query: { name: city.cityName }
  })
}

const deleteCity = (index) => {
  // 从 savedCities 数组中删除对应的城市数据
  savedCities.value.splice(index, 1);

  // 将更新后的 savedCities 数组保存回 localStorage
  localStorage.setItem('weatherData', JSON.stringify(savedCities.value));
}

onMounted(() => {
  const savedCitiesData = localStorage.getItem('weatherData')
  if (savedCitiesData) {
    savedCities.value = JSON.parse(savedCitiesData)
  }
})
</script>

<style scoped lang="scss">
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
h2{
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.city-list {
  margin-top: 20px;
  .city-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 5px;
    //transition: all 0.5s ease;

    .city-item-data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px;
      transition: all 0.5s ease;
      cursor: pointer;
      background-color: rgb(0, 78, 113);
      border-radius: 5px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

      span {
        display: block;
        font-size: 16px;
        font-weight: 500;
        margin: 0 20px;

      }


    }

    .city-item-btn {
      display: none;
      transition: all 0.5s ease;

      .btn {

        width: 60px;
        height: 36px;
        font-size: 16px;
        line-height: 36px;
        text-align: center;
        margin: 0 5px;
        border: none;
        box-shadow: none;
        background-color: orange;

        &:hover {
          background-color: #ff8c00;
        }
      }

    }

    &:hover {
      .city-item-data {
        width: 80%;
      }

      .city-item-btn {
        display: flex;
      }
    }
  }
}
</style>