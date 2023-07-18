import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/mock/mockServe"; //引入mock
import "swiper/css/swiper.css"; //引入swiper样式
import * as API from "@/api";
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
//图片懒加载插件 vue-lazyload
import beauty from "@/assets/beauty.jpg"; //图片、json、css是默认对外暴露的
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload);
Vue.use(VueLazyload, {
  //默认的加载图片
  loading: beauty,
});

//引入表单验证插件
import "@/plugins/validate.js";

//（全局组件注册一次，处处可用）
import TypeNav from "@/components/TypeNav/TypeNav.vue"; //将三级联动注册为全局组件
import Carsousel from "@/components/carousel/carousel.vue"; //将轮播图注册为全局组件
import Pagination from "@/components/Pagination/pagination.vue"; //将分页器注册为全局组件
Vue.component(TypeNav.name, TypeNav); //第一个参数是组件的名字，第二个参数为哪一个组件
Vue.component(Carsousel.name, Carsousel);
Vue.component(Pagination.name, Pagination);
Vue.config.productionTip = false;

// //接口测试

new Vue({
  router,
  store,
  render: (h) => h(App),
  //配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
}).$mount("#app");
