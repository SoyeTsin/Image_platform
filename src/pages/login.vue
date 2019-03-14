<template>
  <div class="login">
    <top class="top"></top>
    <div class="login-body">
      <div class="login-form">
        <div class="form-content" :style="{backgroundImage: 'url(' + login_kuang + ')' }">
          <div class="login-title">用户登录</div>
          <div class="input-box">
            <div class="icon">
              <img src="../assets/login/username.png">
              <div>手机号</div>
            </div>
            <input placeholder="11位手机号" class="so-input" v-model.trim="userParameter.phoneNum" maxlength="25"
                   @input="userFil"></input>
          </div>
          <div class="input-box">
            <div class="icon">
              <img src="../assets/login/password.png">
              <div>验证码</div>
            </div>
            <div class="validate">
              <input placeholder="验证码" class="so-input" v-model.trim="userParameter.smsCode"
                     @keyup.enter="login"></input>
              <div class="button-validate" @click="getSmsCode">获取验证码</div>
            </div>
            <div class="validate-msg" v-if="msg">
              <img src="../assets/login/warning.png"/>
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
  import top from '@/components/top'
  import login_bg_1 from '@/assets/login/login-bg-1.png'
  import login_bg_2 from '@/assets/login/login-bg-2.png'
  import login_kuang from '@/assets/login/login-kuang.png'

  export default {
    name: "login",
    components: {top},
    data() {
      return {
        msg: '',
        login_bg_1,
        login_bg_2,
        login_kuang,
        userParameter: {
          smsCode: '',
          userType: 1,
          phoneNum: '',
        }
      }
    },
    mounted() {
      // axios使用

    },
    methods: {
      userFil() {
        let value = this.userParameter.phoneNum
        this.userParameter.phoneNum = value.replace(/[^0-9]/g, '')
        if (value.length == 11) {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            // callback();
          } else {
            this.msg = '请输入正确的手机号'
          }
        } else if (value.length > 11) {
          this.userParameter.phoneNum = value.substring(0, 11)
        }
      },
      login() {
        let parameter = this.userParameter
        if (!this.userParameter.phoneNum || !this.userParameter.smsCode) {
          this.msg = '手机号和验证码均不能为空'
          return
        }
        if (this.userParameter.phoneNum.length != 11 || this.userParameter.smsCode.length != 6) {
          this.msg = '手机号或验证码输入错误'
          return
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
            // console.log(JSON.stringify(response.data.institution),222222222)
            let institution = JSON.stringify(response.data.institution)
            localStorage.setItem('institution', institution)   //return this
            this.$router.push({
              path: '/imageList'
            })
          })
      },
      getSmsCode() {
        this.initMsg()
        let parameter = {
          phoneNum: this.userParameter.phoneNum
        }
        this.$post('/account/getSmsCode', parameter)
          .then((response) => {
            console.log(response)
            if (response.code != '000000') {
              this.msg = response.msg
              if (response.code == '001001') {
                this.msg = '请输入正确的手机号'
              }
              return
            }
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

