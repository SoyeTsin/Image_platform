<template>
  <el-row class="top-content">
    <el-col :span="6">
      <div class="text-left padding-left">123</div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content ">&nbsp;</div>
    </el-col>
    <el-col :span="6">
      <div class="text-right padding-right">您好，李医生 | 安全退出</div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "top"
  }
</script>

<style lang="scss" scoped>
  @import "../sass/common";

  .top-content {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #1A2B39;
    box-shadow: 0 2px 10px 0 rgba(1,2,3,0.14);
    color: #ffffff;
  }
</style>
