<template>
  <el-container>
    <top class="top"></top>
    <div class="login-form">
      <div class="form-content">
        <div class="login-title">用户登录</div>
        <div class="input-box">
          <div class="icon">
            <img src="./assets/login/username.png">
            <div>手机号</div>
          </div>
          <input placeholder="11位手机号" class="so-input"></input>
        </div>
        <div class="input-box">
          <div class="icon">
            <img src="./assets/login/password.png">
            <div>验证码</div>
          </div>
          <div class="validate">
            <input placeholder="验证码" class="so-input"></input>
            <div class="button-validate">获取验证码</div>
          </div>
          <div class="validate-msg">
            <img src="./assets/login/password.png"/>
            <div>
              请输入正确的账号或验证码
            </div>
          </div>
        </div>
        <div class="login-button">登&nbsp;&nbsp;录</div>
        <div class="login-des">暂不支持注册</div>
      </div>
    </div>
    <div class="bg-title">智能影像体验平台</div>
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

  .login-button {
    background-image: linear-gradient(90deg, #00B5CA 0%, #1CD3BF 100%);
    border-radius: 1px;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #FFFFFF;
    margin: 60px auto 12px auto;
    cursor: pointer;
  }

  .login-button:hover {
    background-image: linear-gradient(90deg, rgba(0, 181, 202, 0.51) 0%, rgba(28, 211, 191, 0.5) 100%);

  }

  .validate-msg {
    img {
      width: 12px;
      height: 12px;
    }

    display: flex;
    justify-content: flex-start;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #FF2929;
    letter-spacing: 1px;
  }

  .login-des {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.70);
    letter-spacing: 1px;
    text-align: center;
  }

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
    height: 390px;
    position: absolute;
    text-align: left;
    color: #ffffff;
    right: 145px;
    top: 202px;
    border: solid 2px rgb(22, 206, 193);
    box-sizing: border-box;
    padding: 0 50px;
  }

  .login-title {
    font-family: MicrosoftYaHei;
    font-size: 20px;
    color: #FFFFFF;
    letter-spacing: 0.9px;
    text-align: center;
    margin: 46px auto 28px auto;
  }

  .input-box {
    position: relative;
    height: 40px;
    margin-bottom: 16px;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }

    .icon {
      display: flex;
      justify-content: flex-start;
      position: absolute;
      top: 50%;
      left: 12px;
      transform: translateY(-50%);
    }

    .validate {
      display: flex;
      justify-content: flex-start;

      .button-validate {
        display: block;
        height: 40px;
        margin-left: 10px;
        background: rgba(1, 196, 159, 0.28);
        border: 0 solid #00FBCC;
        border-radius: 1px;
        line-height: 40px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0.16px;
        cursor: pointer;
        box-sizing: border-box;
        padding: 0 10px;
        white-space: nowrap;
      }

      .button-validate:hover {
        background: rgba(1, 196, 159, 0.5);
      }

      .button-validate:active {
        background: rgba(1, 196, 159, 0.28);
      }
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
      text-indent: 75px;
    }

    .so-input:active, .so-input:hover {
      background: rgba(0, 0, 0, 0.20);
      border: 1px solid #00FBCC;
      box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.48);
      border-radius: 1px;
    }
  }

  .bg-title {
    display: block;
    position: absolute;
    top: 120px;
    left: 256px;
    font-family: PingFangSC-Thin;
    font-size: 40px;
    color: #FFFFFF;
    letter-spacing: 0.44px;
  }
</style>

