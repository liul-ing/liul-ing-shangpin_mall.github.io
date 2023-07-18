//这个文件是对API进行统一管理
//引入封装的axios
import requests from "./request.js";
//引入mock请求的模块
import mockRequests from "./mockRequests.js";

//三级联动接口管理
export const reqCategoryList = () =>
  requests({ url: "/product/getBaseCategoryList", method: "get" });

//获取轮播图数据
export const reqBannerList = () =>
  mockRequests({ url: "/banner", method: " get " });

//获取Floor的数据
export const reqFloorList = () =>
  mockRequests({ url: "/floor", method: "get" });

//Search模块数据 这里要给服务器传递一个默认参数至少是一个空对象
export const reqSearchList = (params) =>
  requests({ url: "/list", method: "post", data: params });

//获取详情页的数据
export const reqDetailList = (skuId) =>
  requests({ url: `/item/${skuId}`, method: "get" });

//添加或者修改购物车
export const reqAddOrUpdateCart = (skuId, skuNum) =>
  requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });

//获取购物车数据
export const reqShopCartList = () =>
  requests({ url: "/cart/cartList", method: "get" });

//删除购物车的商品
export const reqDeleteCart = (skuId) =>
  requests({ url: `cart/deleteCart/${skuId}`, method: "delete" });

//修改商品状态的接口
export const reqUpdateCkeckedById = (skuId, isChecked) =>
  requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" });

//获取验证码的接口
export const reqGetCode = (phone) =>
  requests({ url: `/user/passport/sendCode/${phone}`, method: "get" });

//用户注册
export const reqUserRegister = (data) =>
  requests({ url: "/user/passport/register", data, method: "post" });

//用户登录
export const reqUserLogin = (data) =>
  requests({ url: `/user/passport/login`, method: "post", data });

//携带token向服务器获取用户数据,这个接口不带参数---》在请求头中携带token
export const reqUserInfo = () =>
  requests({ url: "/user/passport/auth/getUserInfo", method: "get" });

//退出登录
export const reqUserLogout = () =>
  requests({ url: "user/passport/logout", method: "get" });

//获取结算页面的地址数据
export const reqAddressInfo = () =>
  requests({
    url: "/user/userAddress/auth/findUserAddressList",
    method: "get",
  });

//获取交易页面商品信息
export const reqOrderInfo = () =>
  requests({ url: "/order/auth/trade", method: "get" });

//提交订单

export const reqSubmitOrder = (tradeNo, data) =>
  requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method: "post",
  });

//获取支付页面的支付信息

export const reqPayInfo = (orderId) =>
  requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: "get",
  });

//获取订单支付状态
export const reqPayStatus = (orderId) =>
  requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: "get",
  });

//获取个人中心的订单列表
export const reqMyOrderList = (page, limit) =>
  requests({
    url: `/order/auth/${page}/${limit}`,
    method: "get",
  });
