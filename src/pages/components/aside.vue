<template>
  <el-container>
    <el-aside width="216px" class="menu-aside"
              style="background-color:#131f2c; position: absolute;left: 0;height: 100%;padding-top: 60px;box-sizing: border-box;">
      <div class="menu-item active">
        <img src="../assets/login/password.png"/>
        <div>用户管理</div>
      </div>
      <div class="menu-item">
        <img src="../assets/login/password.png"/>
        <div>机构管理</div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
  export default {
    name: "leftMenu"
  }
</script>

<style scoped lang="scss">
  .menu-aside {

    .menu-item {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0;
      height: 60px;
      box-sizing: border-box;
      line-height: 60px;
      padding-left: 2px;
      cursor: pointer;
      display: flex;
      justify-content: flex-start;

      img {
        width: 18px;
        height: 18px;
        margin: 21px 16px;
      }
    }

    .menu-item.active {
      padding-left: 0px;
      border-left: solid 2px #28DBB6;
      background: rgba(40, 219, 182, 0.1);
    }

    .menu-item:hover {
      padding-left: 0px;
      border-left: solid 2px rgba(40, 219, 182, 0.51);
      background: rgba(40, 219, 182, 0.2);
    }
  }
</style>
