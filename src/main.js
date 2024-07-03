import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as echarts from 'echarts'
import VueEcharts from "vue-echarts";
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component("v-chart", VueEcharts);
app.mount('#app')