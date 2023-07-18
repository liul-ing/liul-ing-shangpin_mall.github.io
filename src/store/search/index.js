//search模块的小仓库
import { reqSearchList } from "@/api/index.js";
const state = {
  searchList: {},
};
const mutations = {
  GETSEARCHLIST(state, data) {
    state.searchList = data;
  },
};
const actions = {
  async getSearchList({ state, dispatch, commit }, params = {}) {
    //reqGetSearchInfo()获取服务器数据时，至少传递一个参数（空对象）
    //params是当用户派发action时，第二个参数传递过来的
    let result = await reqSearchList(params);
    // console.log(result);
    if (result.data.code == 200) {
      commit("GETSEARCHLIST", result.data.data);
    }
  },
};

//计算属性，为了简化数据而生
const getters = {
  //这里的state是当前仓库的state，并非大仓库的state
  //假如没有网络，请求发不出去，那么state中的searchList是空的，那么searchList.goodsList为undefined
  goodsList(state) {
    return state.searchList.goodsList || [];
  },
  trademarkList(state) {
    return state.searchList.trademarkList || [];
  },
  attrsList(state) {
    return state.searchList.attrsList || [];
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
