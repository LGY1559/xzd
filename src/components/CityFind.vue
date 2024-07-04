<template>
  <div class="text-white">
    <!-- 输入框，用于输入城市名称，绑定到 weatherStore 的 inputCity 属性，并监听输入事件 -->
    <input type="text" placeholder="请输入城市名称" v-model="weatherStore.inputCity" @input="weatherStore.handleInput" />
    <!-- 搜索结果显示区域，当 showSearchResults 为 true 时显示 -->
    <div class="scarch" v-if="weatherStore.showSearchResults">
      <!-- 如果没有搜索结果，显示提示信息 -->
      <p v-if="weatherStore.searchResults.length === 0">似乎没有找到你查找的城市</p>
      <!-- 如果有搜索结果，显示每个结果，并监听点击事件 -->
      <p v-else v-for="result in weatherStore.searchResults" :key="result.id" @click="handleCityClick(result)">
        &nbsp;&nbsp;&nbsp;{{ result.name }}
      </p>
      <!-- 如果网络错误，显示提示信息 -->
      <p v-if="weatherStore.networkError">网络似乎有点问题，请尝试重新输入</p>
    </div>
    <div>
      <!-- 如果保存的城市列表不为空，显示每个保存的城市信息 -->
      <div v-if="weatherStore.savedCities.length > 0" class="font-white gap-3" style="margin-top: 20px">
        <div v-for="(city, index) in weatherStore.savedCities" :key="index" class="city-item">
          <div class="city-item-data">
            <span>{{ city.cityName }}</span>
            <span>{{ city.nowtemp }}℃</span>
          </div>
          <div class="city-item-btn ">
            <!-- 查看城市天气按钮 -->
            <button class="btn font-white" @click="viewCityWeather(city)">查看</button>
            <!-- 删除城市按钮 -->
            <button class="btn font-white" @click="weatherStore.deleteCity(index)">删除</button>
          </div>
        </div>
      </div>
      <!-- 如果保存的城市列表为空，显示提示信息 -->
      <h2 v-else class="text-white text-center">
        暂时没有保存过城市天气信息,请查询后点击左上角"+"号保存
      </h2>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weather'

const router = useRouter()
const weatherStore = useWeatherStore()

// 处理城市点击事件，跳转到天气页面并传递城市信息
const handleCityClick = (result) => {
  console.log('Adcode:', result.adcode)
  weatherStore.clearInput() // 清空输入框
  router.push({
    name: 'weather',
    params: { adcode: result.adcode },
    query: { name: result.name }
  })
}

// 查看城市天气，跳转到天气页面并传递城市信息
const viewCityWeather = (city) => {
  router.push({
    name: 'weather',
    params: { adcode: city.adcode },
    query: { name: city.cityName }
  })
}
</script>

<style scoped lang="scss">
input {
  width: 100%;
  height: 2rem;
  background-color: rgb(0 102 138);
  border-bottom: 1px solid white;
  outline: none;
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

h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.city-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 15px;

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
    }
  }

  .city-item-btn {
    display: none;
    transition: all 0.5s ease;

    .btn {
      width: 60px;
      height: 36px;
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
</style>