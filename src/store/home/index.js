//引入获取数据的接口
import { reqCategoryList, reqBannerList, reqFloorList } from "@/api/index.js";

//home模块的小仓库
const state = {
  categoryList: [],
  bannerList: [],
  floorList: [],
};
const mutations = {
  //三级联动列表数据
  CATEGORYLIST(state, data) {
    state.categoryList = data;
  },
  //轮播图数据
  BANNERLIST(state, data) {
    state.bannerList = data;
  },

  //Floor组件中家用电器数据
  GETFLOORLIST(state, data) {
    state.floorList = data;
  },
};
const actions = {
  //通过接口发请求获取三级联动列表的数据
  async getCategoryList({ commit }) {
    let result = await reqCategoryList();
    // console.log(result);
    if (result.data.code == 200) {
      commit("CATEGORYLIST", result.data.data.splice(0, 15));
    }
  },

  //通过mockjs获取轮播图数据
  async getBannerList({ commit }) {
    let result = await reqBannerList();
    if (result.data.code == 200) {
      commit("BANNERLIST", result.data.data);
    }
  },

  //通过mockjs获取floor的数据
  //获取Floor组件的数据
  async getFloorList({ commit, state, dispatch }) {
    let result = await reqFloorList();
    // console.log(result);
    if (result.data.code == 200) {
      commit("GETFLOORLIST", result.data.data);
      // console.log(result.data);
    }
  },
};
const getters = {};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
