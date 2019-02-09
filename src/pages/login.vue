<template>
  <el-container>
    <top></top>

  </el-container>
</template>

<script>
  import top from './components/top'

  export default {
    name: "login",
    components: {top}
  }
</script>

<style lang="sass" scoped>
  @import "sass/login"
</style>

