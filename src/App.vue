<template>
  <div id="app" :style="{'height':Height}">
    <router-view/>
  </div>
</template>

<script>
  // require('./pages/common/bluebird')
  export default {
    name: 'app',
    computed: {
      Height() {//获取屏幕高度
        return document.body.offsetHeight + 'px'
      }
    }
  }
</script>

<style lang="scss">
  @import "./assets/css/common.css";
  @import "./sass/alicss";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
  }

  .submit {
    background-image: linear-gradient(90deg, #28C3D5 0%, #34EDB6 100%);
    box-shadow: 0 6px 10px 0 rgba(44, 212, 200, 0.25);
    border: 0;
    border-radius: 1px;
    color: #FFFFFF;
    display: block;
    width: 160px;
    height: 36px;
    font-size: 14px;
    margin: 0 auto;
  }

  .vue-slider-dot {
    background: url('../static/fjj-icon/hk.png');
    background-size: 100%;

    .vue-slider-dot-handle {
      background-color: #fff0 !important;
      box-shadow: 0.5px 0.5px 2px 1px rgba(255, 255, 255, 0) !important;
    }
  }
  .selected{
      div{
          span{
              text-align: center;
          }
      }
  }

  .tips {
    height: 88px;
    text-align: center;
    p {
      display: block;
      text-align: left;
      span {
        display: block;
        float: left;
        line-height: 30px;
        height: 30px;
        input{
          width: 100%;
        }
        &:nth-child(1){
          width: 70px;
        }
        &:nth-child(2){
          width:154px;
          position: relative;
          i{
            position: absolute;
            right: 3px;
            top: 1px;
          }
        }
      }
    }

    input {
      border: 1px solid #DDDDDD;
      border-radius: 1px;
      height: 30px;
      text-indent: 10px;
      color: #606473;
    }

    .btn {
      padding-top: 15px;

      span {
        border: 1px solid #C9C9C9;
        border-radius: 2px;
        font-size: 12px;
        color: #606473;
        padding: 6px 18px;
        cursor: pointer;

        &:nth-child(2) {
          margin-left: 10px;
          background: #F6FFFE;
          border: 1px solid #1ECEB8;
          border-radius: 1px;
          color: #1ECEB8;
        }
      }
    }
  }
  .feedback .el-dialog__body{
    text-align: left;
    .submit{
      margin: 40px auto 80px auto;
    }
    .el-checkbox{
      // padding-top: 14px;
    }
    p{
      padding-bottom: 14px;
      span{
        color: #FF5555;
      }
    }
  }
  .text-length{
    position: absolute;
    right: 1px;
    bottom: -34px;
    color: #606266;
  }
  .el-dialog__header{
    text-align: left;
  }
</style>
