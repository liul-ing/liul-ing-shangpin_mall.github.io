<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>

    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>
<script>
//使用组件:引入--》注册---》双标签使用
import Header from "@/components/Header/header.vue";
import Footer from "@/components/Footer/footer.vue";


export default {
  components: {
    Header,
    Footer,

  },
  mounted() {
    //通知vuex派发请求，向服务器获取数据
    this.$store.dispatch("home/getCategoryList");
  },
};
</script>

<style></style>
