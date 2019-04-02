<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 x14>
            <v-card>
                <v-toolbar color="primary" dark card>
                    <v-toolbar-title>
                        Confirma tu dirección de correo
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <span class="subheading">
                        Te hemos enviado un correo de verificiación a la dirección especificada.
                    </span>
                </v-card-text>
                <v-card-text>
                    <v-btn color="secondary" @click="reSendEmail">Reenviar Email</v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { auth } from '@/firebase'
import { mapMutations } from 'vuex'

export default {
    methods:{
        ...mapMutations(['mostrarExito', 'mostrarError']),
        async reSendEmail(){
            try {
                await auth.currentUser.sendEmailVerification()
                this.mostrarExito('Te hemos enviado un nuevo correo de verficación')
                this.$router.push({ name: 'usrhome' })
            } catch (error) {
                this.mostrarError('Ocurrio un error al enviar el email de verificación. Intentalo nuevamente.')
            }
        }
    }
}
</script>
