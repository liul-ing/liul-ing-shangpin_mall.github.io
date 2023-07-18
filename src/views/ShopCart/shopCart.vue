<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <!-- 购物车的数据 -->
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @click="updateChecked(cart)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('plus', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isCheckedAll && cartInfoList.length > 0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      //派发请求获取购物车页面数据
      this.$store.dispatch("shopcart/getShopCartList");
    },

    //点击+/-/用户输入修改购物车数量的事件回调函数
    //点击-时，如果用户点击过快会出现0或者负数的情况--》节流
    handler: throttle(async function (type, disNum, cart) {
      //type是用来区分点击的是+/-/用户输入，disNum是+/-的变化量和input的最终量,cart是点击的产品
      switch (type) {
        case "plus":
          disNum = 1;
          break;
        case "minus":
          //判断产品的个数大于1，才可以传递给服务器-1,当个数x小于等于1时，变化量为0
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          //要判断用书输入是否合法
          if (isNaN(disNum) || disNum < 1) {
            //表示用户输入的是非法的
            disNum = 0;
          } else {
            //输入是正常的情况，但是包含小数
            disNum = parseInt(disNum) - cart.skuNum;
          }
      }
      //派发action向服务器提交数据
      try {
        await this.$store.dispatch("detail/addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        }); //再一次获取服务器最新的数据
        this.getData();
      } catch (error) {}
    }, 500),

    //点击删除操作,删除购物车的商品
    async deleteCartById(cart) {
      try {
        await this.$store.dispatch("shopcart/deleteCart", cart.skuId);
        //删除成功，再次发请求获取数据
        this.getData();
      } catch (error) {
        alert(error);
      }
    },

    //点击复选框操作
    async updateChecked(cart) {
      try {
        //带给服务器的isChecked数据不是布尔值
        let isChecked = event.target.checked ? 1 : 0;
        await this.$store.dispatch("shopcart/changeCheckBox", {
          skuId: cart.skuId,
          isChecked,
        });
        //再次发请求，获取数据
        this.getData();
      } catch (error) {}
    },

    //点击“删除选中商品”
    async deleteAllCheckedCart() {
      try {
        //这个回调函数接收不了商品id等信息且没有一次性删除多个商品的接口
        //在仓库中处理
        await this.$store.dispatch("shopcart/deleteAllCheckedCart");
        //再次发请求
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },

    //全选复选框的事件
    async updateAllCartChecked() {
      //获取自身的复选框的状态
      let isChecked = event.target.checked ? 1 : 0;
      try {
        //派发action
        await this.$store.dispatch("shopcart/updateAllCartChecked", isChecked);
        //再次发请求
        this.getData();
      } catch (error) {
        alser(error.message);
      }
    },
  },
  computed: {
    ...mapGetters({ cartList: "shopcart/cartList" }),
    //获取购物车的数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    //计算购物车商品的总价格
    totalPrice() {
      let totalPrice = 0;
      //遍历购物车数据的数组，计算每个商品的总价，最后求和
      this.cartInfoList.forEach((item) => {
        totalPrice += item.skuNum * item.skuPrice;
      });
      return totalPrice;
    },
    //判断底下的全选复选框是否选中
    isCheckedAll() {
      //遍历数组，只有数组元素isChecked全部为1时返回真，否则为假
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
