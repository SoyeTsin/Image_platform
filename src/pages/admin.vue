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
            <input placeholder="输入用户名" class="so-input" v-model.trim="userParameter.userName"></input>
          </div>
          <div class="input-box">
            <div class="icon">
              <img src="./assets/login/password.png">
              <div>密码</div>
            </div>
            <input placeholder="输入密码" type="password" class="so-input" v-model.trim="userParameter.password"
                   @keyup.enter="login"></input>
            <div class="validate-msg" v-if="msg">
              <img src="./assets/login/warning.png"/>
              <div>
                {{msg}}
              </div>
            </div>
          </div>
          <div class="login-button" @click="getPublicKey">登&nbsp;&nbsp;录</div>
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
        publicKey: '',
        userParameter: {
          userType: 0,
          password: '',
          userName: '',
        }
      }
    },
    mounted() {
      // axios使用

    },
    methods: {
      getPublicKey() {
        //account/getPublicKey
        if (!this.userParameter.userName || !this.userParameter.password) {
          this.msg = '账户名和密码均不能为空'
          return
        }
        let parameter = {userName: this.userParameter.userName}
        this.$post('account/getPublicKey', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.msg = response.msg
              return
            }
            this.publicKey = response.data.publicKey
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.publicKey)
            let password = encrypt.encrypt(this.userParameter.password)
            this.login(password)
          })
      },
      login(password) {
        if (!this.userParameter.userName || !this.userParameter.password) {
          this.msg = '账户名和密码均不能为空'
          return
        }
        if (this.userParameter.userName.length > 25 || this.userParameter.password.length > 25) {
          this.msg = '账户名或密码长度超过25个字符'
          return
        }
        let parameter = {
          userName: this.userParameter.userName,
          userType: 0,
          password
        }
        this.$post('/account/login', parameter)
          .then((response) => {
            if (response.code != '000000') {
              this.msg = response.msg
              return
            }
            localStorage.setItem('token', response.data.token)   //return this
            localStorage.setItem('userId', response.data.userId)   //return this
            localStorage.setItem('phoneNum', response.data.phoneNum)   //return this
            localStorage.setItem('userName', response.data.userName)   //return this
            localStorage.setItem('userType', response.data.userType)   //return this
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

