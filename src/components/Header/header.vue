<template>
  <div>
    <header class="header">
      <!-- 头部的第一行 -->
      <div class="top">
        <div class="container">
          <div class="loginList">
            <p>尚品汇欢迎您！</p>
            <!-- 根据是否有用户名显示登录与注册 -->
            <!-- 没有登录：显示登录与注册 -->
            <p v-if="!userName">
              <span>请</span>

              <router-link to="/login">登录</router-link>
              <router-link class="register" to="/register">注册</router-link>
            </p>
            <!-- 如果登录显示的是用户名字与退出登录 -->
            <p v-else>
              <a>{{ userName }}</a>
              <a class="register" @click="logOut">退出登录</a>
            </p>
          </div>
          <div class="typeList">
            <router-link to="/center/myorder">我的订单</router-link>
            <router-link to="/shopcart">我的购物车</router-link>
            <a href="###">我的尚品汇</a>
            <a href="###">尚品汇会员</a>
            <a href="###">企业采购</a>
            <a href="###">关注尚品汇</a>
            <a href="###">合作招商</a>
            <a href="###">商家后台</a>
          </div>
        </div>
      </div>
      <!--头部第二行 搜索区域-->
      <div class="bottom">
        <h1 class="logoArea">
          <router-link to="/home" class="logo">
            <img src="./images/logo.png" alt=""
          /></router-link>
        </h1>
        <div class="searchArea">
          <form action="###" class="searchForm">
            <input
              type="text"
              id="autocomplete"
              class="input-error input-xxlarge"
              v-model="keyword"
            />
            <button
              class="sui-btn btn-xlarge btn-danger"
              type="button"
              @click="goSearch"
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  //给组件起一个名字,开发者工具中显示这个组件的时候，显示的就是这个名字
  name: "Header",
  mounted() {
    this.$bus.$on("clear", () => {
      this.keyword = " ";
    });
  },
  data() {
    return {
      keyword: " ",
    };
  },
  methods: {
    //在搜索框中输入内容进行路由跳转，并携带输入的参数
    goSearch() {
      let location = {
        name: "search",
        params: { keyword: this.keyword || undefined },
      };
      //如果携带query参数，则一起传过去
      if (this.$route.query) {
        location.query = this.$route.query;
      }
      this.$router.push(location);
    },

    //点击退出登录
    async logOut() {
      try {
        await this.$store.dispatch("registerAndLogin/userLogOut");
        //退出登录后跳转到首页
        this.$router.push("/home");
      } catch (error) {
        alert(error.message);
      }
    },
  },
  computed: {
    //登陆成功后首页携带token发请求，获取用户名等信息
    userName() {
      return this.$store.state.registerAndLogin.userInfo.loginName;
    },
  },
};
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
