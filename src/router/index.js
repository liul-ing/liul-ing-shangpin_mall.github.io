//配置路由
//第一步：引入插件、安装插件
import VueRouter from "vue-router";
import Vue from "vue";
Vue.use(VueRouter);
//引入路由相关的配置项
import routes from "@/router/routes.js";

//引入仓库
import store from "@/store";
//把人家原型对象的push方法进行保存
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//VueRouter.prototype原型对象添加一个方法
//location:路由跳转相关的信息
VueRouter.prototype.push = function (location, resolve, reject) {
  //当前函数this：即为VueRouter类的实例
  //相当于push方法里面this，是windows【完犊子了】
  //利用人家push方法实现路由跳转，保证push里面this,应该vueRouter类的实例

  //面试:函数apply与call区别?
  //相同的地方:都可以篡改函数里面this
  //不同的地方:apply传递参数 数组  call传递参数 逗号分割

  if (resolve && reject) {
    //代表真:代表着两个形参接受参数【箭头函数】
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    //代表真:代表着两个形参接受参数【箭头函数】
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {}
    );
  }
};

//第二步:暴露VueRouter类的实例
//对外暴露一个路由器,实质是VueRouter类的实例,一个路由器可以管理多个路由
const router = new VueRouter({
  //配置路由
  routes,
  //设置滚动条的位置
  scrollBehavior() {
    //滚动行为这个函数,需要有返回值,返回值为一个对象。
    //经常可以设置滚动条x|y位置 [x|y数值的设置一般最小是零]
    return { y: 0 };
  },
});

export default router;

//全局守卫:只要项目中有任何路由变化，全局守卫都会进行拦截【符合条件走你，不符合条件不能访问】

//全局守卫:全局前置守卫【访问之前进行触发】

//全局前置守卫
router.beforeEach(async (to, from, next) => {
  //to:去的那个路由的信息  from:从那个路由而来的信息
  //next:放行函数!!!!!!
  //第一种：next(),放行函数，放行到它想去的路由！！！
  //第二种:next(path),守卫指定放行到那个路由去?

  //用户是否登录:取决于仓库里面是否有token！！！
  //每一次路由跳转之前需要用有用户信息在跳转,没有发请求获取用户信息在跳转！！！！
  //token
  let token = store.state.registerAndLogin.token;
  //用户信息
  let name = store.state.registerAndLogin.userInfo.name;
  //用户登录  只有登录成功之后才有token
  if (token) {
    //1、用户登录成功
    //1.1 用户登录了之后往登录页跳转
    if (to.path == "/login") {
      next("/home");
    } else {
      //1.2 用户登录了之后往其他页面跳转 如果没有用户信息就要派发请求获取，用来在header中展示“用户名与退出登录”
      if (name) {
        next();
      } else {
        try {
          //1.2.1发请求获取用户信息以后再放行
          await store.dispatch("registerAndLogin/getUserInfo");
          next();
        } catch (error) {
          //1.2.2派发请求获取用户信息失败---》token失效 那么本地清空数据、服务器的token通知服务器清除，到登录页面重新登录
          await store.dispatch("registerAndLogin/userLogOut");
          next("/login");
        }
      }
    }
  } else {
    //未登录的情况 不能去交易相关、支付相关的页面、不能去个人中心
    let toPath = to.path;
    if (
      toPath.indexOf("/trade") !== -1 ||
      toPath.indexOf("/pay") !== -1 ||
      toPath.indexOf("/center") !== -1
    ) {
      //把未登录的时候想去而未去成的页面保存在地址栏中
      next("/login?redirect=" + toPath);
    } else {
      next();
    }
  }
});

//全局后置守卫,几乎不用
// router.afterEach((to,from)=>{
//   console.log('后置守卫');
// })
