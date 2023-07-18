import {
  reqShopCartList,
  reqDeleteCart,
  reqUpdateCkeckedById,
} from "@/api/index.js";
const state = {
  shopCartList: [],
};
const mutations = {
  SHOPCARTLIST(state, data) {
    state.shopCartList = data;
  },
};
const actions = {
  //获取购物车数据
  async getShopCartList({ commit }) {
    let result = await reqShopCartList();
    if (result.data.code == 200) {
      commit("SHOPCARTLIST", result.data.data);
    }
  },

  //根据id删除购物车商品数据
  async deleteCart({ commit }, skuId) {
    let result = await reqDeleteCart(skuId);
    if (result.data.code == 200) {
      //如果删除成功，就返回表示成功
      return "ok";
    } else {
      //删除失败就，返回失败的Promise
      return Promise.reject(new Error("faile"));
    }
  },

  //修改商品复选框状态
  async changeCheckBox({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCkeckedById(skuId, isChecked);
    if (result.data.code == 200) {
      return "ok";
    } else {
      //修改状态失败就，返回失败的Promise
      return Promise.reject(new Error("faile"));
    }
  },

  //删除选中商品
  deleteAllCheckedCart(context) {
    // context是小仓库，包含shopcart仓库里的state,getters,actions,mutations
    // console.log(context.getters.cartList.cartInfoList);
    // 遍历购物车里的数据进行删除
    context.getters.cartList.cartInfoList.forEach((item) => {
      //派发根据id删除商品的请求,返回的是promise,删除一个商品就返回一个promise
      let promiseAll = [];
      let result =
        item.isChecked == 1 ? context.dispatch("deleteCart", item.skuId) : " ";
      promiseAll.push(result);
    });
    // promiseAll里只要有一个删除失败就返回失败
    return Promise.all(promiseAll);
  },

  //全选复选框的操作
  updateAllCartChecked(context, isChecked) {
    //传过来的isChecked是“全选”复选框的状态
    //遍历购物车里的所有商品
    let promiseAll = [];
    context.getters.cartList.cartInfoList.forEach((item) => {
      //派发请求修改商品的复选框
      let result = context.dispatch("changeCheckBox", {
        skuId: item.skuId,
        isChecked: isChecked,
      });
      promiseAll.push(result);
    });

    // promiseAll里只要有一个修改失败就返回失败
    return Promise.all(promiseAll);
  },
};
const getters = {
  cartList(state) {
    return state.shopCartList[0] || {};
  },
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
