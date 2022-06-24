<template>
  <div class="header">
    <div class="leftBox">
      <img src="@/assets/img/wx.jpg" alt="商城图片" title="商城图片" />
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    // 点击退出登录
    logout() {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("activePath");
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  font-size: 20px;
  color: #fff;
  align-items: center;
  justify-content: space-between;
  .leftBox {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      width: 60px;
    }
    span {
      margin-left: 20px;
    }
  }
}
</style>