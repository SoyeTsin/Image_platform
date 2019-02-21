<template>
  <div class="top-content">
    <el-col :span="12">
      <div class="title-logo">
        <img :src="logo"/>
        <div class="logo-line"></div>
        <div class="text-left">智能影像体验平台{{roleText}}</div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="text-right padding-right">您好，李医生 | 安全退出</div>
    </el-col>
  </div>
</template>

<script>
  import logo from '../assets/logo@2x.png'

  export default {
    name: "top",
    data() {
      return {
        logo,
        roleText: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sass/common";

  .title-logo {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    padding-left: 20px;

    .logo-line {
      display: block;
      content: '';
      margin: 21px 30px;
      background: #474747;
      width: 1px;
      height: 18px;
    }

    img {
      height: 25px;
      margin: 17.5px 0;
    }
  }

  .top-content {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #1A2B39;
    box-shadow: 0 2px 10px 0 rgba(1, 2, 3, 0.14);
    font-family: MicrosoftYaHei;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0.16px;
    position: relative;
    z-index: 100;
  }
</style>
