<template>
  <div class="aside">
    <!-- 侧边栏菜单区域 -->
    <el-menu
      unique-opened
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409Eff"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <div class="toggle-button" @click="toggleCollapse">
        <i class="el-icon-more"></i>
      </div>

      <!-- 一级菜单 -->
      <el-submenu
        :index="String(item.id)"
        v-for="item in menuList"
        :key="item.id"
      >
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/home/' + item.path"
          v-for="item in item.children"
          :key="item.id"
          @click="saveNavState('/home/' + item.path)"
        >
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <span>{{ item.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      // 一级菜单的图标数据
      iconsObj: {
        147: "el-icon-magic-stick",
        125: "el-icon-s-custom",
        103: "el-icon-s-management",
        101: "el-icon-s-cooperation",
        102: "el-icon-s-order",
        145: "el-icon-s-platform",
      },
      // 是否折叠与收缩
      isCollapse: false,
      // 当前的路径
      activePath:
        window.sessionStorage.getItem("activePath") || "/home/welcome",
    };
  },
  // 接受菜单列表数据
  props: ["menuList"],
  methods: {
    // 点击切换折叠与收缩
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("widthChange", this.isCollapse);
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // console.log(activePath);
      // 这个是为了防止刷新页面后，数据都丢失了又回到welcome
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  mounted() {
    this.$bus.$on("towelcome", this.saveNavState);
  },
};
</script>

<style lang="less" scoped>
span {
  margin-left: 10px;
}
.el-menu {
  border: none;
}
.toggle-button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 20px;
}
</style>