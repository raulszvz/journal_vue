<template>
  <v-layout text-xs-center align-start justify-center>
    <!--<v-card class="elevation-6">
      <v-card-text>
        <div class="ma-2">{{ usuario.name }}</div>
        <img class="ma-2 fotoPerfil" :src="require('@/assets/fotoUsuario.png')" alt="">
        <div class="ma-2">Institución: {{ usuario.institution }}</div>
        <div class="ma-2">Calle: {{ usuario.street }}</div>
        <div class="ma-2">Número: {{ usuario.number }}</div>
        <div class="ma-2">Colonia: {{ usuario.colony }}</div>
        <div class="ma-2">Codigo postal: {{ usuario.zipC }}</div>
        <div class="ma-2">Municipio: {{ usuario.municipality }}</div>
        <div class="ma-2">Estado: {{ usuario.state }}</div>
        <div class="ma-2">País: {{ usuario.country }}</div>
        <div class="ma-2">Telefono: {{ usuario.phone }}</div>
      </v-card-text>
    </v-card>-->
    <v-flex xs12 sm10 md6 lg8 xl4>
    <template>
      <v-expansion-panel>
        <v-expansion-panel-content disabled>
          <template v-slot:header>
            <div>{{ usuario.name }}</div>
          </template>
          <v-card>
            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Institución</div>
          </template>
          <v-card>
            <v-card-text><v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.institution }}</v-chip></v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Dirección</div>
          </template>
          <v-card>
            <v-card-text>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.street }} {{ usuario.number }}</v-chip>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.colony }}</v-chip>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.zipC }}</v-chip>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.municipality }}</v-chip>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.state }}</v-chip>
              <v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.country }}</v-chip>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Contacto</div>
          </template>
          <v-card>
            <v-card-text><v-chip color="orange" text-color="white"><v-avatar><v-icon>account_circle</v-icon></v-avatar>{{ usuario.phone }}</v-chip></v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Constancia</div>
          </template>
          <v-card>
            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
  </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
//import store from '@/store'

export default {
  computed: {
    ...mapState('sesion', ['usuario'])
  }
}
</script>

<style>

.fotoPerfil {
  width: 200px;
  height: 100%;
}

.link {
  text-decoration: none;
  font-size: 1rem;
  color: #553f75;
}

</style>
