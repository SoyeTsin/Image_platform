import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import fjjCT from '@/pages/fjjCT'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/fjjCT',
      name: 'fjjCT',
      component: fjjCT
    }
  ]
})
