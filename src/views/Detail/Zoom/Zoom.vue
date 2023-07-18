<template>
  <div class="spec-preview">
    <!-- 这里的0会报错--》服务器得先有数据才能获取--》父组件传数据时||[] -->
    <img :src="imgObj.imgUrl" />

    <!-- 鼠标移动触发事件 -->
    <div class="event" @mousemove="handler"></div>
    <div class="big" ref="big">
      <img :src="imgObj.imgUrl" />
    </div>

    <!-- 放大镜的那个遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Zoom",
  props: ["skuImageList"],
  computed: {
    imgObj() {
      return this.skuImageList[this.currentIndex] || {};
    },
  },
  data() {
    return {
      currentIndex: 0, //用来接收兄弟组件传来的索引
    };
  },
  mounted() {
    //获取兄弟组件传来的图片索引
    this.$bus.$on("getIndex", (index) => {
      this.currentIndex = index;
    });
  },
  methods: {
    handler(e) {
      //获取放大镜的遮罩层
      let mask = this.$refs.mask;
      let big = this.$refs.big;
      //计算元素定位的left与top值并修改原始值
      let l = e.offsetX - mask.offsetWidth / 2;
      let t = e.offsetY - mask.offsetHeight / 2;
      //考虑left与top的特殊范围
      if (l <= 0) l = 0;
      if (l >= mask.offsetWidth) l = mask.offsetWidth;
      if (t <= 0) t = 0;
      if (t >= mask.offsetHeight) t = mask.offsetHeight;
      //修改蒙版定位的left与top值
      mask.style.left = l + "px";
      mask.style.top = t + "px";
      //修改图片对应的位置
      big.style.left = -2 * l + "px";
      big.style.top = -2 * t + "px";
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
