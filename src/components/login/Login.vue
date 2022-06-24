<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="@/assets/img/hutao.gif" alt="胡桃" />
      </div>
      <!-- 表单提交区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="80px"
        class="login-form"
      >
        <!-- 用户名区域 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button @click="login">提交</el-button>
          <el-button @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 网络请求部分
import { getLogindata } from "@/network/login";

export default {
  name: "Login",
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录按钮
    login() {
      this.$refs.loginFormRef.validate(async (boolean) => {
        if (!boolean) {
          return;
        }
        const { data } = await getLogindata(this.loginForm);
        // console.log(data);
        if (data.meta.status !== 200) {
          // console.log("登录失败");
          this.$message.error("登录失败");
        } else {
          // console.log("登录成功");
          this.$message.success("登录成功");
          // 1. 将登录成功之后的token，保存到客户端的sessionStorage中
          // 1.1 项目中除了登录之外的其他AI篇接口，必须在登录之后才能访问
          // 1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          // 2. 通过编程式导航跳转到后台主页，路由地址是/home
          window.sessionStorage.setItem("token", data.data.token);
          this.$router.push("/home");
          // 加这条是为了登录成功后默认显示的是welcome页面
          // window.sessionStorage.setItem("activePath", "/home/welcome");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    // 居中效果
    position: absolute;
    // 方法一
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // margin: auto;
    // 方法二
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      height: 130px;
      width: 130px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 3px #ddd;
      border-radius: 50%;
      border: 10px solid #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .btns {
      text-align: center;
    }
  }
}
</style>