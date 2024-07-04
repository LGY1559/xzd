<template>
  <div class="weather text-center text-white">
    <div class="flex">
      <ul>
        <li>今天</li>
        <li>{{ day0.date ? day0.date.slice(-5) : '' }}</li>
        <li>{{ day0.dayweather }}</li>
        <li>风力{{ day0.daypower }}级</li>
      </ul>
      <ul>
        <li>明天</li>
        <li>{{ day1.date ? day1.date.slice(-5) : '' }}</li>
        <li>{{ day1.dayweather }}</li>
        <li>风力{{ day1.daypower }}级</li>
      </ul>
      <ul>
        <li>周{{ weekToChinese(day2.week) }}</li>
        <li>{{ day2.date ? day2.date.slice(-5) : '' }}</li>
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

<script setup>
import {  computed } from 'vue'

const props = defineProps({
  day0: Object,
  day1: Object,
  day2: Object,
  day3: Object,
  hightemp: Array,
  lowtemp: Array
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

const options = computed(() => ({
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
      data: props.hightemp,
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
      data: props.lowtemp,
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
}))
</script>

<style scoped>
.weather {
  padding: 2rem;
  background-color: rgb(0 78 113);
}
ul {
  width: 25%;
}
li {
  height: 2.5rem;
}
</style>