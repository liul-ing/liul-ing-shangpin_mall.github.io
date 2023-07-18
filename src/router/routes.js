//引入组件
//路由懒加载：将不同的路由对应的组件分割成不同的代码块，当路由被访问到的时候才加载对应组件

import Search from "@/views/Search/search.vue";
import Deatil from "@/views/Detail/detail.vue";
import addCartSuccess from "@/views/AddCartSuccess/addCartSuccess.vue";
import shopCart from "@/views/ShopCart/shopCart.vue";
import Trade from "@/views/Trade/trade.vue";
import Pay from "@/views/Pay/pay.vue";
import paySuccess from "@/views/PaySuccess/paysuccess.vue";
import Center from "@/views/Center/center.vue";

// 引入个人中心的两个二级路由
import myOrder from "@/views/Center/myOrder/myOrder.vue";
import groupOrder from "@/views/Center/groupOrder/groupOrder.vue";

//路由配置信息:前面3个是路由懒加载演示
export default [
  { path: "/", redirect: "/home" },

  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home/home.vue"),
    meta: { show: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login/login.vue"),
    meta: { show: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register/register.vue"),
    meta: { show: false },
  },
  {
    path: "/search:keyword?",
    name: "search",
    component: Search,
    meta: { show: true },
  },

  {
    path: "/detail/:skuId?",
    name: "detail",
    component: Deatil,
  },
  {
    path: "/addcartsuccess",
    name: "addcartsuccess",
    component: addCartSuccess,
  },
  {
    path: "/shopcart",
    name: "shopCart",
    component: shopCart,
  },
  //路由独享守卫，只有从购物车的结算按钮才可以到交易页面，否则就从哪来回哪去
  {
    path: "/trade",
    name: "trade",
    component: Trade,
    beforeEnter: (to, from, next) => {
      if (from.path == "/shopcart") {
        next();
      } else {
        next(false); //从哪来回哪去
      }
    },
  },
  //路由独享守卫，只有从交易页面的提交订单按钮才可以到支付页面，否则就从哪来回哪去
  {
    path: "/pay",
    name: "pay",
    component: Pay,
    beforeEnter: (to, from, next) => {
      if (from.path == "/trade") {
        next();
      } else {
        next(false); //从哪来回哪去
      }
    },
  },
  //路由独享守卫，只有从支付页面才能到支付成功页面，否则就从哪来回哪去
  {
    path: "/paysuccess",
    name: "paysuccess",
    component: paySuccess,
    beforeEnter: (to, from, next) => {
      if (from.path == "/pay") {
        next();
      } else {
        next(false); //从哪来回哪去
      }
    },
  },
  {
    path: "/center",
    name: "center",
    component: Center,
    redirect: "/center/myorder",
    children: [
      {
        path: "myorder",
        name: "myorder",
        component: myOrder,
      },
      {
        path: "grouporder",
        name: "grouporder",
        component: groupOrder,
      },
    ],
  },
];
