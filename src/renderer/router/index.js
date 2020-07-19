import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'/',
      name:'license-page',
      component:require('@/components/layouts/BlankLayout').default,
      redirect:'/license',
      children:[
        {
          path:'/license',
          name:'license',
          component:require('@/components/license/license').default,
        },
      ]
    },
    {
      path: '/service',
      name: 'landing-page',
      component: require('@/components/layouts/TabLayout').default,
      redirect: '/service/house',
      children:[

        {
          path:'/service/house',
          name:'house',
          component:require('@/components/fangyuan/FangYuanIndex').default,
        },
        {
          path:'/service/customer',
          name:'customer',
          component: require('@/components/kehu/KeHuIndex').default,
        }
      ]
    },

    {
      path: '*',
      redirect: '/'
    }
  ]
})
router.beforeEach((to,from,next)=>{
 // console.log(to)
  next();
})
export default router
