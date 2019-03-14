<template>
  <el-container>
    <el-aside width="216px" class="menu-aside"
              style="background-color:#131f2c; position: absolute;left: 0;height: 100%;padding-top: 60px;box-sizing: border-box;">
      <div v-for="item in menu" @click="intoFun(item)">
        <router-link :to="item.path">
          <div :class="menuType==item.id?'menu-item active':'menu-item'">
            <img :src="item.icon"/>
            <div>{{item.name}}</div>
          </div>
        </router-link>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
  import icon_1 from '../assets/login/userInfo.png'
  import icon_2 from '../assets/login/mechanism.png'

  export default {
    name: "leftMenu",
    data() {
      return {
        menuType: 0,
        menuClass: 'menu-item active',
        menu: [
          {
            id: 0,
            icon: icon_1,
            name: '用户管理',
            path: '/userinfo'
          }, {
            id: 1,
            icon: icon_2,
            name: '机构管理',
            path: '/mechanism'
          }
        ]
      }
    },
    mounted() {
      let path = this.$route.path
      for (let i in this.menu) {
        if (path == this.menu[i].path) {
          this.menuType = this.menu[i].id
        }
      }
    },
    methods: {
      intoFun(item) {
        this.menuType = item.id
      },
    }
  }
</script>

<style scoped lang="scss">
  .menu-aside {
    z-index: 99;

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
