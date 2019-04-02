import { auth, db } from '@/firebase'
import router from '@/router'

export default {
    namespaced: true,
    state: {
      usuario: null
    },
    mutations: {
      actualizarUsuario(state, usuario) {
        state.usuario = usuario
      }
    },
    actions: {
      async iniciarSesion({ commit, getters }, uid) {
        try {
          let doc = await db.collection('usr')
                            .doc(uid)
                            .get()
  
          if(doc.exists) {
            let usuario = doc.data()
            commit('actualizarUsuario', usuario)
  
            switch(router.currentRoute.name) {
              case 'login':
                commit('mostrarExito', getters.saludo, { root: true })
                router.push({ name: 'usrhome' })
                break
  
              case 'acciones-email':
                commit('mostrarExito', getters.saludo + ', tu contraseña ha sido cambiada exitosamente.', { root: true})
                router.push({ name: 'usrhome' })
                break
            }
            
          }
          else {
            router.push({ name: 'signIn' })
          }
        }
        catch (error) {
          commit('mostrarError', 'Ocurrió un error consultando tu información.', { root: true })
        }
      },
      cerrarSesion({ commit }) {
        auth.signOut()
        commit('actualizarUsuario', null)
      }    
    },
    getters: {
      saludo(state) {
        if (!state.usuario) {
          return ''
        }

        return `¡Bienvenid@ ${state.usuario.name}!`
      }
    }
  }