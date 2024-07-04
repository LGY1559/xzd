//这里配置封装一下axios
import axios from "axios";
//生成一个axios实例
const request = axios.create({
  baseURL: "https://restapi.amap.com/v3",
  timeout: 5000,
});
export default request;
