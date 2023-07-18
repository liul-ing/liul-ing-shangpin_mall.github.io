<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread   面包屑 带有X的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 三级分类的面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName">
              {{ searchParams.categoryName }}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-show="searchParams.keyword">
              {{ searchParams.keyword }}
              <i @click="removeKeyeord">×</i>
            </li>

            <!-- 关于品牌信息的面包屑 -->
            <li class="with-x" v-show="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="removeTrademark">×</i>
            </li>

            <!-- 关于商品售卖属性的面包屑 -->
            <li
              class="with-x"
              v-for="(attr, index) in searchParams.props"
              :key="index"
            >
              {{ attr.split(":")[1] }}
              <i @click="removeAttrs(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector    关于商品的品牌、显示屏尺寸等信息-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrsInfo="attrsInfo" />

        <!--details  详情  -->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>综合 <span v-show="isOne"></span></a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格
                    <span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{ 'icon-down': isDesc, 'icon-up': isAsc }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 详细的商品展示页 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 分页  子组件给父组件传递当前点击的是哪一页 -->
          <Pagination
            :pageNo="this.searchParams.pageNo"
            :pageSize="this.searchParams.pageSize"
            continues="5"
            :total="total"
            @changePageNo="changePageNo"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",

  components: {
    SearchSelector,
  },

  beforeMount() {
    //在发请求前重新整理参数
    this.searchParams.category1Id = this.$route.query.category1Id;
    this.searchParams.category2Id = this.$route.query.category2Id;
    this.searchParams.category3Id = this.$route.query.category3Id;
    this.searchParams.categoryName = this.$route.query.categoryName;
    this.searchParams.keyword = this.$route.params.keyword;
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters({ goodsList: "search/goodsList" }),
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    ...mapState({
      total: (state) => state.search.searchList.total, //获得分页器一共有多少条数据
    }),
  },
  methods: {
    //派发请求，获取Search模块数据(根据参数不同，返回不同的数据进行展示)
    getData() {
      this.$store.dispatch("search/getSearchList", this.searchParams);
    },

    //点击面包屑的x，删除与三级联动有关面包屑
    //清除面包屑-商品名字
    removeCategoryName() {
      //搜索条件商品名字清空
      this.searchParams.categoryName = "";
      //categoryName都空了，那么对应id都要清空 设置为undefined就可以不用带给服务器--》性能优化
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      //上述操作把发请求时的参数都清空了，但是路径没变---》骚操作:路由自己跳自己；本意是删除query参数，所以如果有params参数还是需要带过去
      this.$router.push({ name: "search", params: this.$route.params });
    },

    //点击面包屑的x，删除与关键字有关的面包屑
    removeKeyeord() {
      //将关键字置空
      this.searchParams.keyword = "";
      // 重新发请求
      this.getData();
      //通知兄弟组件Header将搜索框内容清空
      this.$bus.$emit("clear");
      //解决路由路径中还有keyword参数---》路由自己跳自己，记得带上query参数
      this.$router.push({ name: "search", query: this.$route.query });
    },
    //点击面包屑的x，删除与品牌信息字有关的面包屑
    removeTrademark() {
      //将关键字置空
      this.searchParams.trademark = "";
      // 重新发请求
      this.getData();
      //解决路由路径中还有keyword参数---》路由自己跳自己，记得带上query参数
      this.$router.push({ name: "search", query: this.$route.query });
    },

    //点击面包屑的x，删除与售卖属性有关的面包屑
    removeAttrs(index) {
      this.searchParams.props.splice(index, 1);
      // 重新发请求
      this.getData();
    },

    // 自定义事件，接收子组件传过来的品牌信息
    trademarkInfo(trademarkInfo) {
      //获得子组件传来的品牌信息，整理参数，重新发送请求
      this.searchParams.trademark = `${trademarkInfo.tmId}:${trademarkInfo.tmName}`;
      this.getData();
    },
    //自定义事件，接收子组件传过来的商品的售卖属性
    attrsInfo(attrs, value) {
      // 整理参数，重新发送请求 searchParams中属性参数的格式:["属性ID:属性值:属性名"]
      let props = `${attrs.attrId}:${value}:${attrs.attrName}`;
      // 数组去重,解决重复点击一个属性时会出现多个面包屑 -1表示没有
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
      }
      this.getData();
    },
    //自定义事件，获取分页器组件传来的当前页码数
    changePageNo(page) {
      //整理参数并且重新发请求获取数据
      this.searchParams.pageNo = page;
      this.getData();
    },

    changeOrder(flag) {
      // flag表示点击的是综合/价格 1是综合，2是价格
      console.log(flag);
      let originalOrder = this.searchParams.order; //获得searchParams里关于排序的初始默认值
      let originalFlag = originalOrder.split(":")[0]; //获得searchParams里关于排序的初始是综合还是价格
      let originalSort = originalOrder.split(":")[1]; //获得searchParams里关于排序的初始是升序还是降序、
      let newOrder = " ";
      if (flag == originalFlag) {
        //表示用户点击的是与初始默认的值一样 本案例中初始值是综合
        //重新设置新状态 如果一开始默认升序，那么点击后变为降序
        newOrder = `${originalFlag}:${originalSort == "desc" ? "asc" : "desc"}`;
      } else {
        //点击的是与初始默认值不同的选项 在本案例为价格
        newOrder = `${flag}:${"desc"}`;
      }
      //重新整理参数并发请求
      this.searchParams.order = newOrder;
      this.getData();
    },
  },
  data() {
    return {
      //带给服务器的参数
      searchParams: {
        //1级分类id
        category1Id: "",
        //2级分类id
        category2Id: "",
        //3级分类id
        category3Id: "",
        //分类的名字
        categoryName: "",
        //header组件的搜索框中输入的内容
        keyword: "",
        // 价格升/降序  1表示综合，2表示价格 desc表示降序，asc表示升序  初始默认值为综合且降序
        order: "1:desc",
        // 分页器，表示当前是第几页
        pageNo: 1,
        // 每一页显示多少数据
        pageSize: 10,
        // 平台售卖属性
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },
  //监听组件实例身上属性的属性值变化
  watch: {
    //监听路由信息是否发生变化，若发生变化则再次发请求获取数据
    $route(newValue, oldValue) {
      //重新整理参数
      this.searchParams.category1Id = this.$route.query.category1Id;
      this.searchParams.category2Id = this.$route.query.category2Id;
      this.searchParams.category3Id = this.$route.query.category3Id;
      this.searchParams.categoryName = this.$route.query.categoryName;
      this.searchParams.keyword = this.$route.params.keyword;
      //再次发请求
      this.$store.dispatch("search/getSearchList", this.searchParams);
      //每次请求完毕，应该将相应的1、2、3及分类的id清空，让它接受下一次的新id
      this.searchParams.category1Id = " ";
      this.searchParams.category2Id = " ";
      this.searchParams.category3Id = " ";
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
