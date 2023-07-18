import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

//引入小仓库
import home from "./home/index.js";
import search from "./search/index.js";
import detail from "./detail/index.js";
import shopcart from "./shopCart/index.js";
import registerAndLogin from "./registerAndLogin/index.js";
import trade from "./trade/index.js";
export default new Vuex.Store({
  modules: {
    home,
    search,
    detail,
    shopcart,
    registerAndLogin,
    trade,
  },
});
