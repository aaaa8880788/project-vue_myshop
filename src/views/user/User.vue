<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 卡片视图区域 -->
    <CardView />
  </div>
</template>

<script>
import BreadNav from "@/components/common/BreadNav";
import CardView from "@/views/user/child/CardView";

export default {
  name: "User",
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "用户管理",
        data03: "用户列表",
      },
    };
  },
  components: {
    BreadNav,
    CardView,
  },
};
</script>
