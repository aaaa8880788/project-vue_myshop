<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 商品参数卡片区域 -->
    <el-card>
      <!-- 注意提示消息部分 -->
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <!-- 选择商品分类部分 -->
      <el-row class="opt_goodsCate">
        <el-col :span="2.5">
          <span>选择商品分类：</span>
        </el-col>
        <el-col :span="10">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model用来指定选中值 -->
          <el-cascader
            clearable
            v-model="selectedValue"
            :options="goodCateList"
            :props="cascaderProps"
            @change="goodCateChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 1.添加参数按钮 -->
          <el-button
            type="primary"
            size="medium "
            :disabled="isBtnDisabled"
            @click="addDialog"
            >添加参数</el-button
          >
          <!-- 2.动态参数表格部分 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <!-- 参数名称列 -->
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="medium"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  @click="deleteParpams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 1.添加属性按钮 -->
          <el-button
            type="primary"
            size="medium "
            :disabled="isBtnDisabled"
            @click="addDialog"
            >添加属性</el-button
          >
          <!-- 2.静态属性表格部分 -->
          <el-table :data="onlyTableData" style="width: 100%" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <!-- 属性名称列 -->
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="medium"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-delete"
                  @click="deleteParpams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 对话框部分 -->
      <!-- 添加参数/属性对话框 -->
      <el-dialog
        :title="`添加${titleText}`"
        :visible.sync="addDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="addDialogClosed"
      >
        <!-- 主体内容区 -->

        <el-form
          :model="addForm"
          status-icon
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input
              v-model="addForm.attr_name"
              clearable
            ></el-input> </el-form-item
        ></el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogDone()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数对话框 -->
      <el-dialog
        :title="`修改${titleText}`"
        :visible.sync="editDialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="editDialogClosed"
      >
        <!-- 主体内容区 -->

        <el-form
          :model="editForm"
          status-icon
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input
              v-model="editForm.attr_name"
              clearable
            ></el-input> </el-form-item
        ></el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogDone">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入面包屑组件
import BreadNav from "@/components/common/BreadNav";

// 网络请求导入部分
import {
  getgoodscateListdata,
  getParamsListdata,
  addParamsOrAttributes,
  editCommitParams,
  deleteParams,
} from "@/network/goods";

export default {
  name: "Params",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "商品管理",
        data03: "参数列表",
      },
      // 商品分类列表数据
      goodCateList: [],

      // 级联选择器部分数据
      // 级联选择器选中的值
      selectedValue: [],
      // 级联选择器配置对象
      cascaderProps: {
        // 选中时传给selectedValue的值
        value: "cat_id",
        // 显示的文本
        label: "cat_name",
        // 子集
        children: "children",
        // hover触发子菜单
        expandTrigger: "hover",
      },

      // tab页签区域数据
      // 被激活的页签名称,默认为many
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],

      // 添加对话框部分
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加对话框表单的数据
      addForm: {
        attr_name: "",
      },
      // 添加对话框校验规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "输入内容不能为空",
            trigger: "blur",
          },
        ],
      },

      // 编辑对话框部分
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑对话框表单数据
      editForm: {
        attr_name: "",
        attrId: 0,
        attr_sel: "",
      },
      // 编辑对话框校验规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "输入内容不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 网络请求部分

    // 获取所有的商品分类列表
    async getGoodsCateList() {
      const { data } = await getgoodscateListdata();
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取商品分类列表失败！");
      } else {
        this.goodCateList = data.data;
        // console.log(this.goodCateList);
      }
    },

    // 级联选择器部分
    // 级联选择器选中值时触发
    goodCateChange() {
      // console.log(this.selectedValue);
      if (this.selectedValue.length !== 3) {
        this.$message.warning("只允许选择第三级分类");
        // 将级联选择器里面的内容清空
        this.selectedValue = [];
        // 将动态参数表和静态属性表也清空
        this.manyTableData = [];
        this.onlyTableData = [];
      } else {
        // 证明选中的是三级分类
        // console.log(this.selectedValue);
        // 发送网络请求获取添加动态参数或者静态属性数据
        // 根据所选分类的id和当前所处的面板，获取对应的参数
        this.getParamsData();
      }
    },

    // tab标签部分
    // tab标签的两个面板点击时触发
    handleTabClick() {
      // console.log(this.activeName);
      if (this.cateId) {
        this.getParamsData();
      }
    },
    // 获取参数的列表数据
    async getParamsData() {
      const { data } = await getParamsListdata(this.cateId, this.activeName);
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取参数数据失败");
      } else {
        // 展开列部分的

        // 在这里将每一个参数的attr_vals分解成各个字符串存进数组,因为它原本时以空格分隔的一大串字符串
        // 这里用三元引入如果item.attr_vals为空.那么用split以空格分隔出来的是个[" "],而这种情况我们要的时[]
        data.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框中输入的值
          item.inputValue = "";
        });
        // console.log(data.data);
        // 动态参数
        if (this.activeName === "many") {
          this.manyTableData = data.data;
          // console.log("this.manyTableData");
          // console.log(this.manyTableData);
        }
        // 静态参数
        else {
          this.onlyTableData = data.data;
          // console.log("this.onlyTableData");
          // console.log(this.onlyTableData);
        }
      }
    },
    // 点击添加参数/添加属性按钮触发
    addDialog() {
      this.addDialogVisible = true;
    },
    // 关闭添加对话框时触发
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击对话框确定按钮触发
    addDialogDone() {
      // 先验证表单
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("表单内容不可为空");
        } else {
          // 发送添加参数/属性网络请求
          const { data } = await addParamsOrAttributes(
            this.cateId,
            this.addForm.attr_name,
            this.activeName
          );
          // console.log(data);
          if (data.meta.status !== 201) {
            this.$message.error(`添加${this.titleText}失败`);
            this.addDialogVisible = false;
          } else {
            this.$message.success(`添加${this.titleText}成功`);
            // 刷新列表
            this.getParamsData();
            this.addDialogVisible = false;
          }
        }
      });
    },
    // 点击编辑按钮触发事件
    editDialog(data) {
      // console.log(data);
      this.editForm.attr_name = data.attr_name;
      this.editForm.attrId = data.attr_id;
      this.editForm.attr_sel = data.attr_sel;
      this.editDialogVisible = true;
      console.log(this.editForm);
    },
    // 点击编辑按钮后的确定按钮触发事件
    editDialogDone() {
      // 先进行表单校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("输入内容不能为空");
        } else {
          const { data } = await editCommitParams({
            id: this.cateId,
            // attrId: this.editForm.attrId,
            // attr_sel: this.editForm.attr_sel,
            // attr_name: this.editForm.attr_name,
            ...this.editForm,
          });
          // console.log(data);
          if (data.meta.status !== 200) {
            this.$message.error("修改失败!");
            this.editDialogVisible = false;
          } else {
            this.$message.success("修改成功!");
            // 更新列表
            this.getParamsData();
            this.editDialogVisible = false;
          }
        }
      });
    },
    // 编辑对话框关闭时触发
    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields();
    },
    // 点击删除按钮后触发
    async deleteParpams(params) {
      const confirmResult = await this.$confirm(
        `此操作将永久删除该${this.titleText}, 是否继续?`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "confirm") {
        // console.log("删除成功");
        // console.log(data);
        const { data } = await deleteParams(this.cateId, params.attr_id);
        console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("删除失败!");
        } else {
          // 更新列表
          this.getParamsData();
          this.$message.success("删除成功!");
        }
      }
    },

    // 展开列部分
    // 失去焦点时或者键盘Enter抬起时触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        // console.log(row);
      } else {
        // 证明输入的内容需要做后续处理
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        row.inputVisible = false;

        // 需要发起请求,更新保存操作
        this.saveAttrVals(row);
      }
    },
    // 鼠标点击按钮时触发
    showInput(data) {
      data.inputVisible = true;
      // 让文本框自动获取焦点
      // $nextTick 方法的作用,就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 展开列中的各个显示参数的关闭触发事件
    handleClose(index, row) {
      console.log(index);
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
    // 用于展开列中参数attr_vals修改的更新
    async saveAttrVals(row) {
      // 需要发起请求,保存操作
      const { data } = await editCommitParams({
        id: this.cateId,
        attrId: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      });
      if (data.meta.status !== 200) {
        this.$message.error("操作失败");
      } else {
        this.$message.success("操作成功");
      }
    },
  },
  created() {
    this.getGoodsCateList();
  },
  computed: {
    // 按钮是否是否禁用
    isBtnDisabled() {
      if (this.selectedValue.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    // 当前选中的三级分类的Id
    cateId() {
      if (this.selectedValue.length == 3) {
        return this.selectedValue[2];
      } else {
        return null;
      }
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.opt_goodsCate {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.el-tabs {
  margin-top: 20px;
}
.el-tag {
  margin: 10px 20px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
}
</style>