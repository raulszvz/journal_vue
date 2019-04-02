import Vue from 'vue'
import Router from 'vue-router'
import { auth } from '@/firebase'
import Home from './views/Home.vue'
import signIn from './views/usrs/signIn.vue'
import login from './views/usrs/login.vue'
import emailVerification from './views/usrs/emailVerification.vue'
import emailActions from './views/usrs/emailActions.vue'
import profile from './views/usrs/profile.vue'
import usrhome from './views/usrs/usrhome.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/emailVerification',
      name: 'emailVerification',
      component: emailVerification
    },
    {
      path: '/emailActions',
      name: 'emailActions',
      component: emailActions
    },
    {
      path: '/profile',
      name: 'profile',
      component: profile,
      meta: {
        autenticado: true
      }
    },
    {
      path: '/usrhome',
      name: 'usrhome',
      component: usrhome,
      meta: {
        autenticado: true
      }
    },
  ]
})

router.beforeEach((to, from, next) =>{
  let user = auth.currentUser
  if(to.matched.some(record => record.meta.autenticado)){
    if(user){
      if (user.providerData[0].providerId == 'password' && !user.emailVerified) {
        next({ name: 'emailVerification' })
      }
      else{
        next()
      }
    }
    else{
      next({ name: 'login' })
    }
  }
  else{
    next()
  }
})

export default router
