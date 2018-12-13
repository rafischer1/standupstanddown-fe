import Vue from 'vue'
import Router from 'vue-router'
import TeamsStore from '../stores/TeamsStore'
import SignUp from '../components/SignUp.vue'
import Profile from '../components/Profile.vue'
import Sprint from '../components/Sprint.vue'
import NotFound from '../components/error-pages/NotFound.vue'
// import { props } from '../App'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Profile',
      component: Profile,
      props: TeamsStore.data,
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/sprint',
      name: 'Sprint',
      component: Sprint,
    },
  ],
})
