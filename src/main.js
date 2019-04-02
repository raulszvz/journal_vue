import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { auth } from './firebase'
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueSimplemde)

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('sesion/iniciarSesion', user.uid)
  }
  else {
    store.dispatch('sesion/cerrarSesion')
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
