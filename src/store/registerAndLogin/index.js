import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqUserInfo,
  reqUserLogout,
} from "@/api/index.js";
const state = {
  code: "",
  //身份标识符很重要【存储在vuex】
  token: localStorage.getItem("TOKEN"),
  userInfo: {},
};
const mutations = {
  GETCODE(state, data) {
    state.code = data;
  },

  //用户登录成功后，服务器下发的token
  USERLOGIN(state, data) {
    state.token = data;
  },

  USERINFO(state, data) {
    state.userInfo = data;
  },
  //清除用户的所有数据
  CLEARALLUSERINFO(state) {
    state.userInfo = {};
    state.token = "";
    //本地存储数据清空
    localStorage.removeItem("TOKEN");
  },
};
const actions = {
  //获取验证码
  async getCode({ commit }, phone) {
    //正常情况下是将验证码发到用户手机上
    let result = await reqGetCode(phone);
    if (result.data.code == 200) {
      commit("GETCODE", result.data.data);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  //用户注册
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user);
    if (result.data.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  //用户登录
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data);
    console.log(result);
    if (result.data.code == 200) {
      commit("USERLOGIN", result.data.data.token);
      //以后开发的时候:经常的登录的成功获取token【持久化存储】
      localStorage.setItem("TOKEN", result.data.data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  //获取用户信息
  async getUserInfo({ commit }) {
    let result = await reqUserInfo();
    if (result.data.code == 200) {
      //提交用户信息
      commit("USERINFO", result.data.data);
    }
  },

  //退出登录
  async userLogOut({ commit }) {
    //这里只是向服务器发请求，通知服务器清除token
    let result = await reqUserLogout();
    console.log(result, "logout");
    if (result.data.code == 200) {
      //清除本地用户信息、toekn等
      commit("CLEARALLUSERINFO");
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
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
