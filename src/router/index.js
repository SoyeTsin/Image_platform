import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import login from '@/pages/login'
import admin from '@/pages/admin'
import fjjCT from '@/pages/fjjCT'
import mechanism from '@/pages/mechanism'
import userinfo from '@/pages/userinfo'
import personalReport from '@/pages/personalReport'
import report from '@/pages/report'
import imageList from '@/pages/imageList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      des: '管理登录页面',
      path: '/admin',
      name: 'admin',
      component: admin
    }, {
      des: '登录页面',
      path: '/login',
      name: 'login',
      component: login
    },
    {
      des: '影像列表',
      path: '/imageList',
      name: 'imageList',
      component: imageList
    },
    {
      des: '影像管理',
      path: '/fjjCT',
      name: 'fjjCT',
      component: fjjCT
    }, {
      des: '主页',
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          des: '机构管理',
          path: '/mechanism',
          name: 'mechanism',
          component: mechanism
        }, {
          des: '用户管理',
          path: '/userinfo',
          name: 'userinfo',
          component: userinfo
        }, {
          des: '个人报告',
          path: '/personalReport',
          name: 'personalReport',
          component: personalReport
        },
        {
          des: '诊断结果',
          path: '/report',
          name: 'report',
          component: report
        },
      ], redirect: '/userinfo'//默认显示此子路由
    },
  ]
})
