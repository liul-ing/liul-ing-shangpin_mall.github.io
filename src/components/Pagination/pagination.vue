<template>
  <div class="pagination">
    <h1>pageNo:{{ pageNo }}</h1>
    <h1>start:{{ startNumAndEndNum.start }}</h1>
    <h1>end:{{ startNumAndEndNum.end }}</h1>

    <button :disabled="pageNo == 1" @click="$emit('changePageNo', pageNo - 1)"  >
      上一页
    </button>
    <button
      v-if="startNumAndEndNum.start > 1"
      @click="$emit('changePageNo', 1)"
      :class="{active:pageNo==1}"
    >
      1
    </button>
    <button v-if="startNumAndEndNum.start > 2">···</button>

    <!-- v-for也可以遍历数组，下标从1开始 -->
    <template v-for="(value, index) in startNumAndEndNum.end">
      <button
        :key="index"
        v-if="value >= startNumAndEndNum.start"
        @click="$emit('changePageNo', value)"
        :class="{active:pageNo==value}"
      >
        {{ value }}
      </button></template
    >

    <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
    <button
      v-if="startNumAndEndNum.end < totalPage"
      @click="$emit('changePageNo', totalPage)"
      :class="{active:pageNo==totalPage}"
      
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('changePageNo', pageNo + 1)"
    >
      下一页
    </button>
    <button style="margin-left: 30px">共{{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "continues", "total"],
  computed: {
    //第1步：计算分页器一共有多少页数据
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    //第2步：计算连续页的起始页与终止页
    startNumAndEndNum() {
      let start = 0;
      let end = 0;
      //考虑特殊情况：当总的页数小于连续页时
      if (this.totalPage < this.continues) {
        start = 1;
        end = this.totalPage;
      } else {
        //当总的页数大于连续页时
        start = this.pageNo - parseInt(this.continues / 2);
        end = this.pageNo + parseInt(this.continues / 2);
        //(1)考虑start与end的特殊情况
        if (start < 1) {
          start = 1;
          end = this.continues;
        }
        if (end > this.totalPage) {
          end = this.totalPage;
          start = end - this.continues + 1;
        }
      }
      return { start, end };
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active{
  background-color: skyblue;
}
</style>
