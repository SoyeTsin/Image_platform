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
  @import "./pages/sass/alicss";

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

  .tips {
    height: 88px;
    text-align: center;

    p {
      text-align: left;

      span {
        line-height: 30px;
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
</style>
