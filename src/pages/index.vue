<template>
  <el-container>
    <top></top>
    <menu-aside></menu-aside>
    <div class="so-content">
      <router-view></router-view>
    </div>
  </el-container>
</template>

<script>
  import top from './components/top'
  import menuAside from './components/aside'

  export default {
    name: "index",
    components: {top, menuAside},
    watch: {
      '$router': {
        handler() {
          const that = this
          debugger
          if (route.name === '') {
            that.onShow()
          }
        }
      }
    },
    methods: {
      onShow() {
        this.$router.push({
          path: '/userinfo'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-container {
    height: 100%;
  }

  .so-content {
    height: 100%;
    width: 100%;
    min-width: 1574px;
    box-sizing: border-box;
    padding: 80px 20px 20px 236px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
