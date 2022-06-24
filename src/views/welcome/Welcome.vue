<template>
  <div class="wrapper">
    <div class="header">
      <h2>Welcome</h2>
      <h2>欢迎登录到电商后台管理系统!</h2>
    </div>
    <div class="main">
      <img src="@/assets/img/duck.jpg" alt="" />
      <h2><a href="https://gitee.com/Aa8880788/" target="_blank">Gitee</a></h2>
      <h2>
        <a href="https://space.bilibili.com/474582256" target="_blank"
          >bilibili</a
        >
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style lang="less" scoped>
.wrapper {
  .header {
    color: rgb(167, 125, 132);
    text-align: center;
    font-size: 25px;
  }
  .main {
    a {
      text-decoration: none;
      color: rgb(245, 87, 14);
      border: 5px solid #ccc;
      padding: 10px;
      border-radius: 20px;
    }
    text-align: center;
    h2 {
      margin: 40px;
    }
    img {
      border-radius: 50%;
      width: 20%;
    }
  }
}
</style>