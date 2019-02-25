<template>
  <div class="login">
    <top class="top"></top>
    <div class="login-body">
      <div class="login-form">
        <div class="form-content" :style="{backgroundImage: 'url(' + login_kuang + ')' }">
          <div class="login-title">用户登录</div>
          <div class="input-box">
            <div class="icon">
              <img src="./assets/login/username.png">
              <div>手机号</div>
            </div>
            <input placeholder="11位手机号" class="so-input" v-model="userParameter.phoneNum"></input>
          </div>
          <div class="input-box">
            <div class="icon">
              <img src="./assets/login/password.png">
              <div>验证码</div>
            </div>
            <div class="validate">
              <input placeholder="验证码" class="so-input" v-model="userParameter.smsCode"></input>
              <div class="button-validate" @click="getSmsCode">获取验证码</div>
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
  import login_kuang from './assets/login/login-kuang.png'

  export default {
    name: "login",
    components: {top},
    data() {
      return {
        login_bg_1,
        login_bg_2,
        login_kuang,
        userParameter: {
          smsCode: '',
          userType: 1,
          phoneNum: '178999999',
        }
      }
    },
    mounted() {
      // axios使用

    },
    methods: {
      login() {
        let parameter = this.userParameter
        this.$post('/account/login', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.msg = response.msg
              return
            }
            this.$cookies.set('token', response.data.token)   //return this
            this.$cookies.set('userId', response.data.userId)   //return this
            this.$cookies.set('phoneNum', response.data.phoneNum)   //return this
            this.$cookies.set('routerPath', this.$route.path)   //return this
            this.$router.push({
              path: '/userinfo'
            })
          })
      },
      getSmsCode() {
        let parameter = {
          phoneNum: this.userParameter.phoneNum
        }
        this.$post('/account/getSmsCode', parameter)
          .then((response) => {
            console.log(response)
          })
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "sass/login";

</style>

