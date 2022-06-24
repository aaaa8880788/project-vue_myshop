<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <Header />
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="asideWidth" @widthChange="widthChange(isCollapse)">
        <Aside :menuList="menuList" />
      </el-aside>
      <!-- 右侧内容主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入头部区域Header组件
import Header from "./chilid/Header";
// 引入侧边栏区域aside组件
import Aside from "./chilid/Aside";

// 网络请求部分
import { getMenuListdata } from "@/network/home";

export default {
  name: "Home",
  data() {
    return {
      // 菜单列表数据
      menuList: [],
      // 控制侧边菜单栏的宽度
      asideWidth: "",
      // 定义welcome页面的数据
      welcome: {
        authName: "欢迎光临",
        id: 147,
        order: 1,
        path: "/welcome",
        children: [
          {
            authName: "Welcome",
            id: 124,
            order: 1,
            path: "welcome",
            children: [],
          },
        ],
      },
    };
  },
  components: {
    Header,
    Aside,
  },
  methods: {
    // 获取左侧菜单栏的数据
    async getMenuList() {
      const { data } = await getMenuListdata();
      // console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.menuList.push(...data.data);
        this.menuList.unshift(this.welcome);
        // console.log(this.menuList);
      }
    },
    // 侧边栏宽度改变
    widthChange(isCollapse) {
      if (isCollapse) {
        this.asideWidth = "64px";
      } else {
        this.asideWidth = "200px";
      }
    },
  },
  created() {
    this.getMenuList();
  },
};
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-container {
  .el-header {
    padding-left: 0;
    background-color: #373d41;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>