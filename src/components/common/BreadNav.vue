<template>
  <div class="nav">
    <span @click="toWelcome">{{ BreadData.data01 }}</span>
    <span class="icon">&gt;</span>
    <span>{{ BreadData.data02 }}</span>
    <span class="icon">&gt;</span>
    <span>{{ BreadData.data03 }}</span>
  </div>
</template>

<script>
export default {
  name: "BreadNav",
  props: ["BreadData"],
  methods: {
    // 用全局事件总线的方法，点击首页就会返回welcome
    toWelcome() {
      this.$bus.$emit("towelcome", "/home/welcome");
      this.$router.push("/home/welcome");
    },
  },
};
</script>

<style lang="less" scoped>
.nav {
  margin-bottom: 30px;
  color: #606266;
  font-size: 14px;
  .icon {
    color: #ced2da;
  }
  span:first-child {
    color: #303133;
    font-weight: 700;
  }
  span:first-child:hover {
    color: royalblue;
    cursor: pointer;
  }
  span {
    margin-right: 10px;
  }
}
</style>