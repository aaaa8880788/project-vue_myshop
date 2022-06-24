<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 商品列表卡片区域 -->
    <el-card>
      <!-- 输入内容添加商品区域 -->
      <el-row :gutter="20">
        <!-- 输入内容区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSelectedGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods"> 添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table border :data="goodsListData">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="价格(元)" width="95">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(Kg)" width="110">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | filtertime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editById(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 编辑对话框部分 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editdialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!-- 内容主体区域 -->

      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input v-model.number="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量(Kg)" prop="goods_weight">
          <el-input v-model.number="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 面包屑导航导入
import BreadNav from "@/components/common/BreadNav";

// 网络请求导入部分
import {
  getGoodsListData,
  deleteGoodsData,
  editCommitGoods,
} from "@/network/goods";

export default {
  name: "List",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "商品管理",
        data03: "商品列表",
      },
      // 商品列表查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodsListData: [],
      // 总条数
      total: 0,
      // 编辑对话框的显示与隐藏
      editdialogVisible: false,
      // 编辑表单数据
      editForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: 5,
      },
      // 编辑商品id
      editGoodId: 0,
      // 编辑表单规则
      editFormRules: {
        goods_name: [
          { required: true, message: "商品名称不可为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不可为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不可为空", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不可为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data } = await getGoodsListData(this.queryInfo);
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取商品列表失败！");
      } else {
        this.goodsListData = data.data.goods;
        this.total = data.data.total;
        // this.$message.success("获取商品列表成功！");
        // console.log(this.goodsListData);
        // console.log(this.total);
      }
    },

    // 分页器部分
    // 处理页码大小,本页面显示数量改变的触发
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getGoodsList();
    },
    // 当前页变动时候触发的事件,翻页触发
    handleCurrentChange(pagenum) {
      // console.log(pagenum);
      this.queryInfo.pagenum = pagenum;
      this.getGoodsList();
    },
    // 点击输入内容区域的搜索按钮触发
    getSelectedGoodsList() {
      this.getGoodsList();
    },
    // 点击表格部分删除按钮触发
    async removeById(goods_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      if (confirmResult === "confirm") {
        console.log(goods_id);
        const { data } = await deleteGoodsData(goods_id);
        console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("删除失败！");
        } else {
          this.getGoodsList();
          this.$message.success("删除成功！");
        }
      } else {
        this.$message("取消成功！");
      }
    },
    // 点击添加商品按钮触发事件
    addGoods() {
      this.$router.push("goods/add");
      // console.log(this.$router);
    },
    // 点击编辑按钮触发事件
    editById(row) {
      console.log(row);
      // 进行深拷贝
      const edit = JSON.parse(JSON.stringify(row));
      this.editGoodId = edit.goods_id;
      this.editForm.goods_name = edit.goods_name;
      this.editForm.goods_price = edit.goods_price;
      this.editForm.goods_number = edit.goods_number;
      this.editForm.goods_weight = edit.goods_weight;
      console.log(this.editForm);
      this.editdialogVisible = true;
    },
    // 点击编辑对话框的确定按钮触发
    editGoods() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message("请输入合法内容！");
        } else {
          this.$message("接口文档这个部分有问题，所以搞不了，大致这个思路！");
          this.editdialogVisible = false;
        }
      });
    },
  },
  created() {
    this.getGoodsList();
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
</style>