import { reqAddressInfo, reqOrderInfo } from "@/api/index.js";
const state = {
  addressInfo: [],
  orderInfo: {},
};
const mutations = {
  ADDRESSINFO(state, data) {
    state.addressInfo = data;
  },
  ORDERINFO(state, data) {
    state.orderInfo = data;
  },
};
const actions = {
  //获取交易页面的地址数据
  async getAddressInfo({ commit }) {
    let result = await reqAddressInfo();
    if (result.data.code == 200) {
      commit("ADDRESSINFO", result.data.data);
    }
  },

  //获取交易页面的订单数据
  async getOrderInfo({ commit }) {
    let result = await reqOrderInfo();
    if (result.data.code == 200) {
      commit("ORDERINFO", result.data.data);
    }
  },
};

const getters = {};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
