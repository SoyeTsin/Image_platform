<template>
  <div class="login">
    <top class="top"></top>
    <div class="login-body">
      <div class="login-form">
        <div class="form-content" :style="{backgroundImage: 'url(' + login_kuang + ')' }">
          <div class="login-title">用户登录</div>
          <div class="input-box">
            <div class="icon">
              <img src="./assets/login/usernameadmin.png">
              <div>用户名</div>
            </div>
            <input placeholder="输入用户名" class="so-input" v-model="userParameter.userName"></input>
          </div>
          <div class="input-box">
            <div class="icon">
              <img src="./assets/login/password.png">
              <div>密码</div>
            </div>
            <input placeholder="输入密码" type="password" class="so-input" v-model="userParameter.password"></input>
            <div class="validate-msg" v-if="msg">
              <img src="./assets/login/warning.png"/>
              <div>
                {{msg}}
              </div>
            </div>
          </div>
          <div class="login-button" @click="login">登&nbsp;&nbsp;录</div>
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
    computed() {
      userNameVal()
      {
        return this.userParameter.userName
      }
    },
    data() {
      return {
        login_bg_1,
        login_bg_2,
        login_kuang,
        msg: '',
        userParameter: {
          userType: 0,
          password: '123456',
          userName: 'test1',
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
            localStorage.setItem('token', response.data.token)   //return this
            localStorage.setItem('userId', response.data.userId)   //return this
            localStorage.setItem('phoneNum', response.data.phoneNum)   //return this
            localStorage.setItem('routerPath', this.$route.path)   //return this
            this.$router.push({
              path: '/userinfo'
            })
          })
      },
      initMsg() {
        this.msg = ''
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "sass/login";

</style>

