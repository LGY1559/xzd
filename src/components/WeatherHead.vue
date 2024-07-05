<template>
  <div class="head flex">
    <div class="flex items-center gap-3">
      <RouterLink to="/" class="flex flex-col sm:flex-row items-center gap-4 text-white py-6" @click="refresh">
        <i class="iconfont icon-sun2"></i>
        <span class="text-2xl">LGY天气</span>
      </RouterLink>
      <div class="gap-4 flex items-center">
        <span class="text-lg">{{ weatherStore.cityName }}</span>
        <span class="text-sm"
          >实时天气：{{ weatherStore.nowweather }} {{ weatherStore.nowtemp }}°C {{ weatherStore.nowwind }}风 {{ weatherStore.nowpower }}级</span
        >
      </div>
    </div>
    <div class="flex items-center gap-3">
      <i class="iconfont icon-tishi_mian" @click="showPopup"></i>
    </div>
    <div v-if="isPopupVisible" class="popup">
      <!-- 弹窗内容 -->
      <div class="popup-content">
        <h5>关于:</h5>
        <p>&nbsp;&nbsp;&nbsp;这个应用可以用来追踪你选择城市的当前天气</p>
        <h5>如何使用:</h5>
        <p>&nbsp;&nbsp;&nbsp;1.点击搜索框输入你希望追踪的城市</p>
        <p>&nbsp;&nbsp;&nbsp;2.在搜索结果中选中一个城市，你将获取当地最新的天气</p>
        <p>&nbsp;&nbsp;&nbsp;3.点击右侧的＋号可以将追踪城市的天气情况保存在首页</p>
        <h5>移除城市:</h5>
        <p>&nbsp;&nbsp;&nbsp;如果你不想在首页关注某个城市,可以通过底部的按钮删除它</p>
        <button
          @click="hidePopup"
          style="background-color: rgb(0 78 113); width: 100px; margin-top: 1rem"
          class="text-white"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useWeatherStore } from '../stores/weather'

const weatherStore = useWeatherStore()
const isPopupVisible = ref(false)
const refreshKey = ref(0)

onMounted(() => {
  weatherStore.fetchNowWeather()
  weatherStore.loadSavedCities() // 确保在组件挂载时加载保存的城市数据
})

watch(
  () => weatherStore.cityid,
  () => {
    weatherStore.fetchNowWeather()
  }
)

const showPopup = () => {
  isPopupVisible.value = true
}

const hidePopup = () => {
  isPopupVisible.value = false
}

const refresh = () => {
  refreshKey.value++
  weatherStore.fetchNowWeather() // 确保在刷新 key 的同时重新获取数据
  weatherStore.loadSavedCities() // 重新加载保存的城市数据
}
</script>

<style scoped>
.head {
  width: 100vw;
  background-color: rgb(0 102 138);
  color: white;
  padding: 0 15%;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  justify-content: space-between;
}

a {
  color: white;
  text-decoration: none;
  font-size: 30px;
}

i {
  font-size: 24px;
}
.icon-tishi_mian:hover {
  color: rgb(0 78 113);
  transition: all 0.5s;
}
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: black;
  margin-top: -200px;
}
</style>