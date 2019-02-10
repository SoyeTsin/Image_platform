<template>
  <el-container>
    <top></top>
    <menu-aside></menu-aside>
  </el-container>
</template>

<script>
  import top from './components/top'
  import menuAside from './components/aside'

  export default {
    name: "index",
    components: {top, menuAside},
  }
</script>

<style scoped lang="scss">


  .el-container {
    height: 100%;
  }
</style>
