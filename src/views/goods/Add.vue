<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加商品信息提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="(tabPosition = 'left')"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息部分 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input
                v-model.number="addForm.goods_price"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量(Kg)" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="Number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model.number="addForm.goods_number"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsCateData"
                :props="cascaderProps"
                @change="goodsCateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览窗口 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="30%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 面包屑导航导入
import BreadNav from "@/components/common/BreadNav";

// 网络请求导入
import {
  getgoodscateListdata,
  getParamsListdata,
  addGoodsRequest,
} from "@/network/goods";

// 富文本编辑器的导入

export default {
  name: "Add",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "商品管理",
        data03: "添加商品",
      },
      // 步骤条的激活状态
      activeIndex: "0",
      // 表单数据部分
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: parseInt(""),
        goods_number: "",
        // 级联选择器选中的值
        // 商品所属的分类数组
        goods_cat: [],
        // 上传的图片临时路径
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        // 商品的参数
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      // 基本信息部分

      // 商品分类数据
      goodsCateData: [],
      // 级联选择器部分
      // 级联选择器中的props配置对象
      cascaderProps: {
        // 选中时传给selectedValue的值
        value: "cat_id",
        label: "cat_name",
        // 子集
        children: "children",
        // hover触发子菜单
        expandTrigger: "hover",
      },

      // 商品参数部分

      // 动态参数数据
      manyTableData: [],

      // 商品属性部分

      // 静态属性数据
      onlyTableData: [],

      // 商品图片部分
      // 图片上传地址
      // uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      uploadUrl: "https://lianghj.top:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片预览
      // 图片的存储路径
      previewPath: "",
      // 图片预览对话框显示与隐藏
      previewVisible: false,
    };
  },
  methods: {
    // 请求所有商品分类数据
    async getGoodsCate() {
      const { data } = await getgoodscateListdata();
      if (data.meta.status !== 200) {
        this.$message.error("请求数据失败！");
      } else {
        this.goodsCateData = data.data;
      }
    },
    // 级联选择器选中值时触发
    goodsCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      } else {
        // console.log(this.addForm.goods_cat);
      }
    },
    // tab栏区域切换的时候触发，为了实现从基本信息栏离开的条件为选中了商品分类
    beforeTableave(ActiveName, oldActiveName) {
      // console.log("即将离开的标签页为", oldActiveName);
      // console.log("即将进入的标签页为", ActiveName);
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      } else if (this.addForm.goods_name === "") {
        this.$message.error("请输入商品名称");
        return false;
      } else if (this.addForm.goods_price === 0) {
        this.$message.error("请输入商品价格");
        return false;
      } else if (this.addForm.goods_weight === 0) {
        this.$message.error("请输入商品重量");
        return false;
      } else if (this.addForm.goods_number === 0) {
        this.$message.error("请输入商品数量");
        return false;
      }
    },
    // 当tab栏区域选中某个栏时，触发事件
    async tabClicked() {
      // console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        const { data } = await getParamsListdata(this.cateId, "many");
        // console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("获取动态参数数据失败！");
        } else {
          // 先将attr_val数据进行处理，因为原本里面是字符串,将他们转成数组取出来
          data.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          // 这里给每个item.attr_vals_status值一个布尔值
          // 用于多选框部分

          // 这里因为JSON.prese返回值是一个对象，实现深拷贝
          this.manyTableData = JSON.parse(JSON.stringify(data.data));
          console.log(Object.prototype.toString.call(this.manyTableData));
          // console.log(this.manyTableData);
        }
      } else if (this.activeIndex === "2") {
        const { data } = await getParamsListdata(this.cateId, "only");
        if (data.meta.status !== 200) {
          this.$message.error("获取静态属性数据失败！");
        } else {
          this.onlyTableData = JSON.parse(JSON.stringify(data.data));
          // console.log(this.onlyTableData);
        }
      }
    },
    // 图片上传部分
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // console.log(filePath);
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        return x.pic == filePath;
      });
      // console.log(i);
      // 3.调用数组的splice方法，把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 图片上传成功时触发
    handleSuccess(res) {
      // console.log(res);
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: res.data.tmp_path,
      };
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
    // 点击富文本编辑器下面的添加商品按钮触发
    add() {
      // 进行表单校验
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写必填的表单项！");
        } else {
          // 执行添加的业务逻辑
          // 深拷贝addForm信息,因为级联选择器要求选中的值只能用数组接受，这里又要字符串，冲突了
          const form = JSON.parse(JSON.stringify(this.addForm));
          form.goods_cat = form.goods_cat.join(",");
          // console.log(form);
          // 处理动态参数
          // console.log(this.manyTableData);
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals.join(" "),
            };
            this.addForm.attrs.push(newInfo);
          });
          // 处理静态属性
          // console.log(this.onlyTableData);
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_vals: item.attr_vals,
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;
          // console.log(form);
          // 发起添加商品请求
          const { data } = await addGoodsRequest(form);
          console.log(data);
          console.log("---");
          if (data.meta.status !== 201) {
            this.$message.error(`${data.meta.msg}`);
            console.log(data);
          } else {
            this.$message.success("添加商品成功");
            this.$router.push("/home/goods");
          }
        }
      });
    },
  },
  computed: {
    // 获取商品分类选中的分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
  created() {
    this.getGoodsCate();
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 20px;
}
</style>