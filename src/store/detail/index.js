import { reqDetailList, reqAddOrUpdateCart } from "@/api/index.js";
import { getUUID } from "@/utils/index";
const state = {
  detailInfo: {},
  //获得游客临时身份
  uuid_token: getUUID(),
};
const mutations = {
  GETDETAILINFOLIST(state, data) {
    state.detailInfo = data;
  },
};
const actions = {
  // //获取商品的详细信息
  async getDetailInfo({ commit }, skuId) {
    let result = await reqDetailList(skuId);
    if (result.data.code == 200) {
      commit("GETDETAILINFOLIST", result.data.data);
    }
  },

  //将产品添加到购物车页面
  async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
    //假如购物车返回的解构
    let result = await reqAddOrUpdateCart(skuId, skuNum);
    // console.log(result, "ok");
    if (result.data.code == 200) {
      //如果加入购物车成功,返回promise即为成功
      return "ok";
    } else {
      //如果加入购物车失败，返回失败的Promise
      return Promise.reject(new Error("faile"));
    }
  },
};
const getters = {
  categoryView(state) {
    return state.detailInfo.categoryView || {}; //假如服务器数据未返回，则detailInfo.X值为undefin，所以后面||{}
  },
  skuInfo(state) {
    return state.detailInfo.skuInfo || {};
  },
  spuSaleAttrList(state) {
    return state.detailInfo.spuSaleAttrList;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
