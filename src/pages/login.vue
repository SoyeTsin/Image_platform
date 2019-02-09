<template>
  <el-container>
    <top class="top"></top>
    <div class="login-form">
      <div class="form-content">
        <div>
          <div>手机号</div>
          <input placeholder="请输入账号" class="so-input"></input>
        </div>
        <div>
          <div>验证码</div>
          <input placeholder="验证码" class="so-input"></input>
        </div>
        <el-button>登录</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
  import top from './components/top'

  export default {
    name: "login",
    components: {top}
  }

</script>

<style lang="scss" scoped>
  @import "sass/login";

  .login-form {
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    padding-top: 60px;
    background-image: radial-gradient(50% 0%, #1F2F3C 46%, #111E29 100%);
  }

  .form-content {
    width: 390px;
    height: 446px;
    position: absolute;
    text-align: left;
    color: #ffffff;
  }

  .so-input {
    background: #0F242A;
    border: 1px solid #009987;
    border-radius: 1px;
    height: 40px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    color: #ffffff;
    margin-bottom: 20px;
  }

  .so-input:active, .so-input:hover {
    background: rgba(0, 0, 0, 0.20);
    border: 1px solid #00FBCC;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.48);
    border-radius: 1px;
  }

</style>

