<template>
  <v-app>
    <v-navigation-drawer v-model="menu" app temporary>
      <v-list>

        <v-list-tile v-if="usuario" :to="{name: 'usrhome'}">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Inicio'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="usuario" :to="{name: 'profile'}"> <!--profile-->
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Perfil'"></v-list-tile-title><!--Perfil-->
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="!usuario" :to="{name: 'signIn'}">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Registro'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="!usuario" :to="{name: 'login'}">
          <v-list-tile-action>
            <v-icon>arrow_forward</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Ingresar'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="usuario" @click="salir">
          <v-list-tile-action>
            <v-icon>arrow_back</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Salir'"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar color="primary" dark app>
      <v-toolbar-side-icon @click="menu = !menu"></v-toolbar-side-icon>
      <v-toolbar-title @click="componenteActual = 'home'" class="headline logo">
        <span>{{ title }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer> 
      <!--Revisar--> 
      <router-link class="nombre" :to="{ name: 'profile' }">
        <span v-if="usuario">{{ usuario.name }}</span> 
      </router-link>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <router-view></router-view>
      </v-container> 
    </v-content>

    <v-snackbar v-model="notificacion.visible" :color="notificacion.color" multi-line top :timeout="6000" dark>
      {{notificacion.mensaje }}
      <v-btn color="white" flat @click="ocultarNotificacion">Cerrar</v-btn>
    </v-snackbar>

    <v-dialog v-model="ocupado.visible" max-width="400" persistent>
      <v-card>
        <v-toolbar color="primary" dark card>
          <v-toolbar-title>
            {{ ocupado.titulo }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="subheading">
          {{ ocupado.mensaje }}
        </v-card-text>
        <v-card-text>
          <v-progress-linear :indeterminate="true" color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  <v-footer color="primary" dark>
      <v-layout justify-center>
        <span>Congreso Mexicano de Botanica - UAA</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>

/*import home from '@/views/Home.vue'
import usrhome from '@/views/usrs/usrhome.vue'
import signIn from '@/views/usrs/signIn.vue'
import login from '@/views/usrs/login.vue'
import profile from '@/views/usrs/profile.vue'*/


import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  //components: { home, signIn, login, profile, usrhome },
  name: 'App',
  data () {
    return {
      title: 'Botanica UAA',
      menu: false
    }
  },
  computed: {
    ...mapState(['notificacion', 'ocupado']),
    ...mapState('sesion', ['usuario'])
  },
  methods: {
    ...mapMutations(['ocultarNotificacion']),
    ...mapActions('sesion', ['cerrarSesion']),
    salir() {
      this.cerrarSesion()
      this.menu = false
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>

.nombre {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

</style>

