<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="leaveShow" @mouseenter="enterSow">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 这里用事件委派 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>

                <!-- 二三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//引入lodash进行防抖与节流
import { throttle } from "lodash"; //按需引入

export default {
  name: "TypeNav",
  //组件挂在完毕向服务器发请求，获取数据并展示
  mounted() {
    //当组件挂载完毕，show变为false
    //typeNav在home中是显示的，但是在search中先不显示。如果不是home组件，将typeNav隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },

  computed: {
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
  },

  data() {
    return {
      //这个属性表示鼠标指向哪个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  methods: {
    //鼠标移入一级菜单时就有背景色
    //正常情况下，鼠标进入每个一级分类h3，都会出发鼠标进入事件；
    //而当用户操作很快时，本身全部的一级分类应该都触发鼠标事件，但是经过测试，只有部分触发
    //就是因为用户行为过快，反应不过来。若当前回调函数中有大量业务，就会出现卡顿
    //解决方法：防抖与节流（lodash插件 原理是闭包+延迟器）
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 100), //Es5写法

    //当点击三级联动列表里的内容时，进行路由跳转并传相应的产品、id等参数   解决：编程式导航+事件委派（这样就不用对每个a进行事件绑定了）
    goSearch(evevnt) {
      //event.target.dataset是包含自定义属性的对象；通过自定义属性可以区分是否为a标签/一级分类/二级分类/三级分类·
      let { categoryname, category1id, category2id, category3id } =
        event.target.dataset;
      if (categoryname) {
        //整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        if (category1id) {
          //一级分类
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        //如果带有params参数，则一起传过去
        if (this.$route.paarams) {
          location.params = this.$route.paarams;
        }
        //整理完整参数
        location.query = query;
        this.$router.push(location);
      }
    },

    //在search组件中，移入鼠标则显示三级联动列表
    enterSow() {
      this.show = true;
    },
    //在search组件中，移出鼠标则隐藏三级联动列表
    leaveShow() {
      this.currentIndex = -1; //鼠标移出一级菜单，背景色消失
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    //过渡动画样式
    .sort-enter {
      //过渡动画开始状态
      height: 0;
    }
    //过渡动画结束状态（进入）
    .sort-enter-to {
      height: 461px;
    }
    //定义动画时间、速率
    .sort-enter-activate {
      transition: all 0.5s linear;
    }
  }
}
</style>
