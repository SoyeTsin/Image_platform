import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import login from '@/pages/login'
import fjjCT from '@/pages/fjjCT'
import mechanism from '@/pages/mechanism'
import userinfo from '@/pages/userinfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/fjjCT',
      name: 'fjjCT',
      component: fjjCT
    }, {
      path: '/',
      name: 'index',
      component: index,
      children: [  //这里就是二级路由的配置
        {
          path: '/mechanism',
          name: 'mechanism',
          component: mechanism
        }, {
          path: '/userinfo',
          name: 'userinfo',
          component: userinfo
        }
      ]
    },
  ]
})
