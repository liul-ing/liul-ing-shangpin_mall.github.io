<template>
  <div>
    <TypeNav> </TypeNav>
    <listContainer></listContainer>
    <recommand></recommand>
    <rank></rank>
    <like></like>
    <floor v-for="floor in floorList" :key="floor.id" :list="floor"></floor>
    <brand></brand>
  </div>
</template>

<script>
import listContainer from "@/views/Home/ListContainer/listContainer.vue";
import recommand from "@/views/Home/recommand/recommand.vue";
import rank from "@/views/Home/rank/rank.vue";
import like from "@/views/Home/Like/like.vue";
import floor from "@/views/Home/Floor/floor.vue";
import brand from "@/views/Home/Brand/brand.vue";
import { mapState } from "vuex";

export default {
  components: {
    listContainer,
    recommand,
    rank,
    like,
    floor,
    brand,
  },
  mounted() {
    //派发action，获取floor的数据
    this.$store.dispatch("home/getFloorList");
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>

<style scoped></style>
