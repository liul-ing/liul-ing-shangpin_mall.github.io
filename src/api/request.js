import axios from "axios";
//引入进度条
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";

//引入仓库  目的：获取uuid——token
//获取仓库:存储数据
import store from "@/store";

//创建axios实例
const requests = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

//请求拦截器，在发请求之前，请求拦截器可以拦截到，在发请求前做一些事情
requests.interceptors.request.use(
  //config:配置对象，对象里面有一个属性很重要（headers请求头）
  function (config) {
    // 在发送请求之前做些什么
    //(1)如果有临时身份（uuid_token)，则通过请求头携带
    if (store.state.detail.uuid_token) {
      //请求头的字段不能自己随便写
      config.headers.userTempId = store.state.detail.uuid_token;
    }
    //（2）有token，则携带token
    if (store.state.registerAndLogin.token) {
      //请求头的字段不能自己随便写
      config.headers.token = store.state.registerAndLogin.token;
    }
    //（3）任何发请求的地方，设置进度条开始动
    nprogress.start();
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
requests.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    nprogress.done(); //进度条结束
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

//对外暴漏
export default requests;
