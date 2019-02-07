<template>
  <div id="app" :style="{'height':Height}">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed:{
    Height(){//获取屏幕高度
       return document.body.offsetHeight+'px'
    }
  }
}
</script>

<style lang="scss">
@import "./assets/css/common.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}

</style>
