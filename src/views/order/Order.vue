<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 商品列表卡片区域 -->
    <el-card>
      <!-- 搜索部分 -->
      <el-row>
        <el-col :span="8">
          <el-input
            clearable
            placeholder="请输入订单编号"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchDone"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表单部分 -->
      <el-table border :data="orderData">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120">
        </el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="200">
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrder(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox()"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框部分 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editDialogClosed"
    >
      <!-- 内容主体部分 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="cityData"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部内容区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="LogisticsInfoDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->

      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in LogisticsInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="LogisticsInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="LogisticsInfoDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 面包屑导航导入
import BreadNav from "@/components/common/BreadNav";

// 网络请求部分
import { getOrderListData, getLogisticsInfo } from "@/network/order";

import cityData from "./citydata";

export default {
  name: "Order",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "订单管理",
        data03: "订单列表",
      },
      // 订单列表数据
      orderData: [],
      // 订单列表查询数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单数据
      editForm: {
        // 级联选择器选中值
        address1: [],
        // 输入框输入值
        address2: "",
      },
      // 编辑表单规则
      editFormRules: {
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 级联选择器数据
      cityData,
      // 级联选择器规则
      cascaderProps: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
      },
      // 物流信息
      LogisticsInfo: [],
      // 物流信息对话框的显示与隐藏
      LogisticsInfoDialogVisible: false,
    };
  },
  methods: {
    async getOrderList() {
      const { data } = await getOrderListData(this.queryInfo);
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取订单列表失败！");
      } else {
        this.$message.success("获取订单列表成功！");
        // 深拷贝获取数据
        this.orderData = JSON.parse(JSON.stringify(data.data.goods));
        this.total = JSON.parse(JSON.stringify(data.data.total));
        // console.log(this.orderData);
      }
    },
    // 分页器部分
    // 页码大小改变时触发
    handleSizeChange(value) {
      this.queryInfo.pagesize = value;
      this.getOrderList();
    },
    // 当前页变动时候触发
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value;
      this.getOrderList();
    },
    // 点击编辑订单按钮触发事件
    editOrder(row) {
      // console.log(row);
      this.editDialogVisible = true;
    },
    // 级联选择器选中值时触发
    handleChange() {
      console.log(this.cascaderSelected);
    },
    // 监听对话框关闭事件，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击获取物理进度按钮触发事件，就是那个坐标的小图标
    async showProgressBox() {
      const { data } = await getLogisticsInfo();
      if (data.meta.status !== 200) {
        this.$message.error("获取物流信息失败！");
      } else {
        this.LogisticsInfo = JSON.parse(JSON.stringify(data.data));
        this.LogisticsInfoDialogVisible = true;
        console.log(this.LogisticsInfo);
      }
    },
    // 点击搜索按钮触发
    searchDone() {
      // console.log(this.queryInfo);
      // this.getOrderList();
      this.$message("这个功能接口估计没写，大概就这样操作！");
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>