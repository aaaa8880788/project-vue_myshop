<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 商品分类卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddcateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text=""
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightGreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="medium"
            @click="editCateData(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="medium"
            @click="deleteCateData(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器部分 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 15, 25, 35]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      @close="addCatedialogClosed"
    >
      <!-- 主体内容区 -->
      <el-form
        :model="addCateForm"
        status-icon
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model用来指定选中值 -->
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="editCateDialogClosed"
    >
      <!-- 内容主体区 -->

      <el-form
        :model="editCateForm"
        status-icon
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- 底部区域 -->
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入面包屑组件
import BreadNav from "@/components/common/BreadNav";
// 网络请求部分
import {
  getgoodscateListdata,
  getParentCateListdata,
  editCommitCatedata,
  deleteCate,
} from "@/network/goods";

export default {
  name: "Cate",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "商品管理",
        data03: "商品分类",
      },
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数居条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前的列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isOk",
        },
        {
          label: "排序",
          // 表示将当前的列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前的列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入父类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 父级分类级联选择器中选中的值
      selectedKeys: [],
      // props配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 编辑分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类表单数据对象
      editCateForm: {
        cat_name: "",
      },
      // 编辑表单的验证规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入父类名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 网络数据请求部分
    // 获取商品列表数据
    async getCateList() {
      const { data } = await getgoodscateListdata(this.queryInfo);
      if (data.meta.status !== 200) {
        this.$message.error("获取商品分类数据列表失败！");
      } else {
        // console.log(data);
        this.$message.success("获取商品分类数据列表成功！");
        this.cateList = data.data.result;
        this.total = data.data.total;
        // console.log(this.cateList);
      }
    },
    // 添加分类中的获取父级分类的数据列表
    async getParentCateList() {
      const { data } = await getgoodscateListdata({
        type: 2,
      });
      if (data.meta.status !== 200) {
        this.$message.error("获取父级分类数据失败!");
      } else {
        // console.log(data);
        this.parentCateList = data.data;
        console.log(this.parentCateList);
      }
    },

    // 页面显示条数改变时触发
    handleSizeChange(value) {
      // console.log(value);
      this.queryInfo.pagesize = value;
      this.getCateList();
    },
    // 显示第几页，页数改变时触发
    handleCurrentChange(value) {
      // console.log(value);
      this.queryInfo.pagenum = value;
      this.getCateList();
    },
    // 点击添加分类按钮，显示添加分类对话框
    showAddcateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 添加分类级联选择器选择项变化时触发
    parentCateChange() {
      // console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length为0证明啥也没选中
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加分类对话框点击确定触发
    addCate() {
      // console.log(this.addCateForm);
      // 对表单进行校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请输入合法信息");
        } else {
          const { data } = await getParentCateListdata(this.addCateForm);
          if (data.meta.status !== 201) {
            this.$message.error("添加分类失败");
            this.addCateDialogVisible = false;
          } else {
            console.log(this.addCateForm);
            this.$message.success("添加分类成功");
            // 刷新数据列表
            this.getCateList();
            this.addCateDialogVisible = false;
          }
        }
      });
    },
    // 添加分类对话框关闭时触发
    addCatedialogClosed() {
      this.selectedKeys = [];
      // 重置表单
      this.$refs.addCateFormRef.resetFields();
    },
    // 点击编辑按钮触发事件
    editCateData(data) {
      // console.log(data);
      this.editCateForm.cat_id = data.cat_id;
      this.editCateForm.cat_name = data.cat_name;
      this.editCateDialogVisible = true;
    },
    // 点击编辑对话框里面的确定按钮
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("输入内容不能为空！");
        } else {
          // console.log(this.editCateForm);
          const { data } = await editCommitCatedata(this.editCateForm);
          if (data.meta.status !== 200) {
            this.$message.error("编辑失败");
            this.editCateDialogVisible = false;
          } else {
            // console.log(data);
            this.$message.success("编辑成功");
            // 刷新列表
            this.getCateList();
            this.editCateDialogVisible = false;
          }
        }
      });
    },
    // 编辑对话框关闭触发
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields();
    },
    // 点击删除按钮触发事件
    async deleteCateData(id) {
      const data = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(data);
      if (data === "confirm") {
        // 发送网络请求
        // console.log(id);
        const { data } = await deleteCate(id);
        // console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("删除分类失败");
        } else {
          // 更新列表
          this.getCateList();
          this.$message.success("删除分类成功");
        }
      }
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>