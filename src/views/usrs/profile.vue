<template>
  <v-layout text-xs-center align-start justify-center>
    <v-card class="elevation-6">
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
    </v-card>
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
