import request from './axios'

export const getAll = (city) => {
    return request.get(`/weather/weatherInfo?city=${city}&key=c3c2c4ef9e01ba05da85f3cd4f9cde09&extensions=all`)
}; // 获取预报天气

export const getNow = (city) => {
    return request.get(`/weather/weatherInfo?city=${city}&key=c3c2c4ef9e01ba05da85f3cd4f9cde09&extensions=base`)
}; // 获取实时天气
/* export const getIpCity = () => {
  return request.get("/ip?key=e71a2d0ff06bc3884e134d550f04bc05&ip=124.114.11.220")
} 西安市ip*/
  export const getIpCity = () => {
    return request.get("/ip?key=e71a2d0ff06bc3884e134d550f04bc05")
  }// 获取ip
  export const getCity = (city) => {
    return request.get( `//restapi.amap.com/v3/geocode/geo?key=e71a2d0ff06bc3884e134d550f04bc05&address=${city}`)
  }// 获取城市