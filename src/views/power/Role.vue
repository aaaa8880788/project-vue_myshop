<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <el-card>
      <!-- 添加角色部分 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格显示部分 -->
      <el-table :data="rolesList" border style="width: 100%">
        <!-- 第一列可展开区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      :span="3"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <!-- 操作列，里面放三按钮 -->
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >
              删除
            </el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击分配权限展示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="addRoleDialogclosed"
    >
      <!-- 主体内容区 -->

      <el-form
        :model="addUserForm"
        status-icon
        :rules="addUserFormRules"
        label-width="100px"
        ref="addUserFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoledone">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!-- 主体内容区 -->

      <el-form
        :model="editRoleForm"
        status-icon
        :rules="editRoleFormRules"
        label-width="100px"
        ref="editRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleDone">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入面包屑组件
import BreadNav from "@/components/common/BreadNav";
// 网络请求数据部分
import {
  getRoleList,
  deleteRolePower,
  getAllPowerList,
  giveRolePower,
  addRoleData,
  editRoleData,
  deleteRoleData,
} from "@/network/power";

export default {
  name: "Role",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑数据
      BreadData: {
        data01: "首页",
        data02: "权限管理",
        data03: "角色列表",
      },
      // 所有角色列表数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 树形控件中默认选中节点id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
      // 添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 要添加的角色信息
      addUserForm: {
        roleName: "",
        roleDesc: "",
      },
      // 要添加的角色信息的校验规则
      addUserFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      // 编辑角色的信息存储，用于编辑角色对话框
      editRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑角色里面的输入框校验规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 编辑对话框的显示与隐藏
      editRoleDialogVisible: false,
    };
  },
  methods: {
    // 获取角色列表数据
    async getRoleListdata() {
      const { data } = await getRoleList();
      if (data.meta.status !== 200) {
        this.$message.error("获取角色列表失败");
      } else {
        this.rolesList = data.data;
        this.$message.success("获取角色列表成功");
        // console.log(this.rolesList);
      }
    },
    // 表格第三大部分各个按钮点击促发事件
    // 根据Id删除对应的权限
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult === "cancel") {
        this.$message.info("取消删除成功");
      } else {
        const { data } = await deleteRolePower(role.id, id);
        if (data.meta.status !== 200) {
          this.$message.error("删除权限失败");
        } else {
          this.$message.success("删除权限成功");
          // 更新权限展示列表，因为这里是浅拷贝
          role.children = data.data;
        }
      }
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 将当前角色的id保存下来
      // 为了后面按确定的时候确定分配权限传参用
      this.roleId = role.id;

      // 获取所有权限的数据
      const { data } = await getAllPowerList("tree");
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取权限数据失败！");
      } else {
        this.$message.success("获取权限数据成功！");
        // 这一步将数据存储，因为对话框已经绑定了rightslist，所以一旦有数据，对话框就有所有权限内容了
        this.rightslist = data.data;
        // console.log(this.rightslist);

        // 获取角色列表的三级权限，并将id放入树形控件默认选中节点id值数组中
        // 这里通过递归函数获取
        // console.log(role);
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
      }
    },
    // 通过递归的方式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach((item) => {
          this.getLeafKeys(item, arr);
        });
      }
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 当该对话框关闭时，清空树形控件中默认选中节点id值数组
      this.defKeys = [];
    },
    // 点击确定按钮为角色分配权限
    async allotRights() {
      // 这里先获取所有选中和版选中按钮的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ];
      // 数组的join方法，将数组以逗号(',')作为分隔符转化成字符串
      const idStr = keys.join(",");
      // 网络请求授予权限
      const { data } = await giveRolePower(this.roleId, idStr);
      console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("分配权限失败");
      } else {
        this.$message.success("分配权限成功");
        // 刷新角色列表
        this.getRoleListdata();
        // 将对话框隐藏
        this.setRightDialogVisible = false;
      }
    },
    // 点击添加角色按钮触发事件
    addRole() {
      this.addRoleDialogVisible = true;
    },
    // 点击添加角色里面的确定按钮触发
    addRoledone() {
      // 先进行表单校验
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("角色名称不能为空！");
        } else {
          // console.log(this.addUserForm);
          // 发送网络请求
          const { data } = await addRoleData(
            this.addUserForm.roleName,
            this.addUserForm.roleDesc
          );
          if (data.meta.status !== 201) {
            this.$message.error("添加角色失败");
            this.addRoleDialogVisible = false;
          } else {
            this.$message.success("添加角色成功");
            //  更新角色列表
            this.getRoleListdata();
            // 隐藏对话框
            this.addRoleDialogVisible = false;
          }
        }
      });
    },
    // 添加角色对话框关闭触发
    addRoleDialogclosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 点击操作中的编辑按钮触发
    editRole(role) {
      // console.log(role);
      this.editRoleForm.roleName = role.roleName;
      this.editRoleForm.roleDesc = role.roleDesc;
      this.editRoleForm.id = role.id;
      console.log(this.editRoleForm);
      // 显示编辑角色对话框
      this.editRoleDialogVisible = true;
    },
    // 编辑角色对话框确定按钮触发
    editRoleDone() {
      // 先进行表单校验
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning("请合法输入信息");
        } else {
          const { data } = await editRoleData(this.editRoleForm);
          console.log(data);
          if (data.meta.status !== 200) {
            this.$message.error("编辑失败");
            this.editRoleDialogVisible = false;
          } else {
            this.$message.success("编辑成功");
            // 更新角色列表
            this.getRoleListdata();
            // 隐藏对话框
            this.editRoleDialogVisible = false;
          }
        }
      });
    },
    // 点击操作里的删除按钮触发
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult === "confirm") {
        const { data } = await deleteRoleData(id);
        console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("删除角色失败");
        } else {
          this.$message.success("删除角色成功");
          //  更新数据列表
          this.getRoleListdata();
        }
      }
    },
  },
  created() {
    this.getRoleListdata();
  },
};
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 10px;
  margin-left: 20px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>