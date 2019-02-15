<template>
  <div class="login">
    <top class="top"></top>
    <div class="login-body">
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
              <img src="./assets/login/warning.png"/>
              <div>
                请输入正确的账号或验证码
              </div>
            </div>
          </div>
          <div class="login-button">登&nbsp;&nbsp;录</div>
          <div class="login-des">暂不支持注册</div>
        </div>
      </div>
      <div class="login-bg">
        <div class="login-bg-1">
          <img :src="login_bg_1"/>
        </div>
        <div class="login-bg-2">
          <img :src="login_bg_2"/>
        </div>
      </div>
      <div class="bg-title">智能影像体验平台</div>
    </div>
  </div>
</template>

<script>
  import top from './components/top'
  import login_bg_1 from './assets/login/login-bg-1.png'
  import login_bg_2 from './assets/login/login-bg-2.png'

  export default {
    name: "login",
    components: {top},
    data() {
      return {
        login_bg_1,
        login_bg_2
      }
    },
    mounted() {
      // axios使用
      this.$fetch('/test')
        .then((response) => {
          console.log(response)
        })
    },
  }

</script>

<style lang="scss" scoped>
  @import "sass/login";

</style>

