import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/kehu',
      name: 'landing-page',
      component: require('@/components/fangyuan/FangYuanIndex').default
    },
    {
      path: '/',
      name: 'kehu-page',
      component: require('@/components/kehu/KeHuIndex').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
