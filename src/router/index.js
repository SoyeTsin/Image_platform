import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import admin from '@/pages/admin'
import login from '@/pages/login'
// import admin from '@/pages/admin'
// import fjjCT from '@/pages/fjjCT'
// import mechanism from '@/pages/mechanism'
// import userinfo from '@/pages/userinfo'
// import personalReport from '@/pages/personalReport'
// import statisticalReport from '@/pages/statisticalReport'
// import report from '@/pages/report'
// import imageList from '@/pages/imageList'


const fjjCT = () => import('@/pages/fjjCT')
const mechanism = () => import('@/pages/mechanism')
const userinfo = () => import('@/pages/userinfo')
const personalReport = () => import('@/pages/personalReport')
const statisticalReport = () => import('@/pages/statisticalReport')
const report = () => import('@/pages/report')
const imageList = () => import('@/pages/imageList')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: {
        des: '管理登录页面',
      },
    }, {
      path: '/login',
      name: 'login',
      component: login, meta: {
        des: '登录页面',
      },
    },

    {
      path: '/fjjCT',
      name: 'fjjCT',
      component: fjjCT, meta: {
        des: '影像管理',
      },
    }, {
      path: '/imageList',
      name: 'imageList',
      component: imageList, meta: {
        des: '影像列表',
      },
    },
    {
      path: '/report',
      name: 'report',
      component: report, meta: {
        des: '诊断结果',
      },
    }, {
      path: '/personalReport',
      name: 'personalReport',
      component: personalReport, meta: {
        des: '个人报告',
      },
    }, {
      path: '/statisticalReport',
      name: 'statisticalReport',
      component: statisticalReport, meta: {
        des: '统计报告',
      },
    }, {
      path: '/',
      name: 'index',
      component: index, meta: {
        des: '主页',
      },

      children: [
        {
          path: '/mechanism',
          name: 'mechanism',
          component: mechanism, meta: {
            des: '机构管理',
          },
        }, {
          path: '/userinfo',
          name: 'userinfo',
          component: userinfo, meta: {
            des: '用户管理',
          },
        },
      ], redirect: '/login'//默认显示此子路由
    },
  ]
})
