<template>
  <el-card class="box-card">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUsersListdata()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUsersListdata()"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primayr" @click="addDialogVisible = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="70px "
<<<<<<< HEAD
        ref="addFormRef"
        status-icon
=======
        ref="aaaa"
>>>>>>> rights
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户列表区域 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-tooltip content="编辑" placement="top" :enterable="false">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 分配角色按钮 -->
          <el-tooltip content="分配角色" placement="top" :enterable="false">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!-- 内容主题区 -->
      <el-form
        status-icon
        :model="editForm"
        :rules="editFormRules"
        label-width="70px "
        ref="editFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      :close-on-click-modal="true"
      @close="setRoleDialogClosed"
    >
      <!-- 信息主体区域 -->
      <div>
        <el-row class="vcenter">
          <el-col :span="4">当前的用户名:</el-col>
          <el-col :span="10"
            ><el-input
              placeholder="请输入内容"
              v-model="userInfo.username"
              :disabled="true"
            >
            </el-input
          ></el-col>
        </el-row>
        <el-row class="vcenter">
          <el-col :span="4">当前的角色:</el-col>
          <el-col :span="10"
            ><el-input
              placeholder="请输入内容"
              v-model="userInfo.role_name"
              :disabled="true"
            >
            </el-input
          ></el-col>
        </el-row>
        <el-row class="vcenter">
          <el-col :span="4">分配新角色:</el-col>
          <el-col :span="10">
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 6, 12]"
      :page-size="queryInfo.pages"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import {
  getUsersListdata,
  updatauserstate,
  addUserData,
  getUserdata,
  changeUserdata,
  removeUserdata,
} from "@/network/users";

import { getRoleList, giverolestatus } from "@/network/power";

export default {
  name: "CardView",
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号"));
      }
    };
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;

      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };

    return {
      // 获取用户列表数据
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 本页的数据量
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑用户数据
      editForm: {},
      // 编辑用户数据的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 分配角色对话框中的角色信息
      userInfo: {},
      // 分配角色中的角色列表信息
      rolesList: [],
      // 分配角色中分配的角色id
      selectedRoleId: "",
    };
  },
  methods: {
    // 网络请求获取用户列表数据
    async getUsersListdata() {
      const { data } = await getUsersListdata(this.queryInfo);
      // console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      } else {
        this.userList = data.data.users;
        this.total = data.data.total;
        return this.$message.success("获取用户列表成功！");
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsersListdata();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUsersListdata();
    },
    // 监听用户状态的改变
    async userStateChanged(userInfo) {
      // console.log(userInfo);
      const { data } = await updatauserstate({
        uId: userInfo.id,
        type: userInfo.mg_state,
      });
      // console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.error("更新用户状态失败！");
      } else {
        this.$message.success("更新用户状态成功！");
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请输入合法的用户信息");
        } else {
          // console.log(this.addForm);
          // 发起添加用户网络请求
          const { data } = await addUserData(this.addForm);
          // console.log(data);
          if (data.meta.status !== 201) {
            this.$message.error("添加用户失败!");
          } else {
            this.$message.success("添加用户成功!");
            // 隐藏添加用户的对话框
            this.addDialogVisible = false;
            // 重新获取用户列表数据
            this.getUsersListdata();
          }
        }
      });
    },
    // 点击展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);
      // 发送查询用户信息请求
      const { data } = await getUserdata(id);
      // console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.erro("获取用户信息失败");
      } else {
        this.editForm = data.data;
        this.editDialogVisible = true;
        // console.log(this.editForm);
      }
    },
    // 编辑用户信息是否成功校验
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请输入合法的用户信息");
        } else {
          // 发起修改用户信息的数据的请求
          const { data } = await changeUserdata(this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          });
          // console.log(data);
          if (data.meta.status !== 200) {
            this.$message.error("更新用户信息失败");
          } else {
            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            this.getUsersListdata();
            // 提示用户修改成功
            this.$message.success("更新用户信息成功");
          }
        }
      });
    },
    // 根据ID删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "是否确定永久删除该用户?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      // 如果用户确认删除，则返回confirm
      // 如果用户取消删除，则返回cancel
      if (confirmResult !== "confirm") {
        this.$message.info("取消删除用户成功");
      } else {
        // 删除用户信息
        const { data } = await removeUserdata(id);
        console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("删除用户失败");
        } else {
          // 更新列表
          this.getUsersListdata();
          this.$message.success("用户删除成功");
        }
      }
    },
    // 点击分配角色按钮触发事件
    async setRole(userInfo) {
      // 将当前的行数据保存
      this.userInfo = userInfo;
      // console.log(this.userInfo);
      // 在展示对话框之前获取所有角色列表
      const { data } = await getRoleList();
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取角色列表失败！");
      } else {
        // 将角色列表存储
        this.rolesList = data.data;
        // console.log(this.rolesList);

        // 显示分配角色对话框
        this.setRoleDialogVisible = true;
      }
    },
    // 点击分配角色对话框确认按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        this.$message.error("请选择要分配的角色！");
      } else {
        // 发送分配角色网络请求
        const { data } = await giverolestatus(
          this.userInfo.id,
          this.selectedRoleId
        );
        // console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("分配用户角色失败");
        } else {
          this.$message.success("分配用户角色成功");
          // 更新用户列表数据
          this.getUsersListdata();
          // 隐藏分配角色对话框
          this.setRoleDialogVisible = false;
        }
      }
    },
    // 分配角色对话框关闭触发事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = [];
    },
  },
  created() {
    this.getUsersListdata();
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
.el-pagination {
  margin-top: 20px;
}
.vcenter {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
</style>