<template>
  <div>
    <!-- 面包屑区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 权限列表展示 -->
    <el-card>
      <el-table :data="rightsList" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-show="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-show="scope.row.level === '2'"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入面包屑组件
import BreadNav from "@/components/common/BreadNav";
// 网络请求部分
import { getAllPowerList } from "@/network/power";

export default {
  name: "Right",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "权限管理",
        data03: "权限列表",
      },
      // 权限列表数据
      rightsList: [],
    };
  },
  methods: {
    async getrightsList() {
      const { data } = await getAllPowerList("list");
      if (data.meta.status !== 200) {
        this.$message.error("获取权限列表失败！");
      } else {
        this.$message.success("获取权限列表成功！");
        this.rightsList = data.data;
        // console.log(data);
      }
    },
  },
  created() {
    this.getrightsList();
  },
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>