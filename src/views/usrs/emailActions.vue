<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm10 md6 lg8 xl4>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Regístrate
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="subheading">
              Ingresa una nueva contraseña para {{ email }}
          </v-card-text>
          <v-card-text>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-text-field label="Contraseña" v-model="form.pass" :error-messages="erroresPass" @blur="$v.form.pass.$touch()" type="password"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field label="Repetir contraseña" v-model="form.pass2" :error-messages="erroresPass2" @blur="$v.form.pass2.$touch()" type="password"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex>
                        <v-btn @click="newPass" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid" color="secondary">Aceptar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { auth } from '@/firebase'
import { mapMutations, mapGetters } from 'vuex'

export default {
    data(){
        return{
            actionCode:'',
            email:'',
            form:{
                pass:'',
                pass2:''
            }
        }
    },
    validations:{
    form: {
      pass:{
        required,
        minLength:minLength(6),
        maxLength:maxLength(20)
      },
      pass2:{
        sameAs: sameAs('pass')
      }
    }
  },
    methods: {
        ...mapMutations(['mostrarExito','mostrarError','mostrarInformacion','mostrarOcupado','ocultarOcupado']),
        ...mapMutations('sesion', ['actualizarUsuario']),
        async validate(){
            let mode = this.$route.query.mode
            this.actionCode = this.$route.query.oobCode
            switch (mode) {
                case 'verifyEmail':
                    this.mostrarOcupado({ titulo:'Verificando código', mensaje: 'Validando el código de verficación' })
                    try {
                        await auth.applyActionCode(this.actionCode)
                        this.mostrarExito('Email validado con exito. Ingresa tus credenciales para continuar')
                        this.$router.push({ name: 'login' })
                    } catch (error) {
                        this.mostrarError(error)
                    }
                    finally{
                        this.ocultarOcupado()
                    }
                    break
                case 'resetPassword':
                    this.mostrarOcupado({ titulo:'Verificando código', mensaje:'Validando código para restablecimiento de contraseña.' })
                    try {
                        this.email = await auth.verifyPasswordResetCode(this.actionCode)
                        this.mostrarInformacion('Ingresa una nueva contraseña para ' + this.email)
                    } catch (error) {
                        this.mostrarError(error)
                    }
                    finally{
                        this.ocultarOcupado()
                    }
                    break
            }
        },    
        async newPass(){
            this.mostrarOcupado({ titulo:'Estableciendo contraseña', mensaje:'Cambiando contraseña...' })
            try {
                await auth.confirmPasswordReset(this.actionCode, this.form.pass)
                await auth.signInWithEmailAndPassword(this.email, this.form.pass)
                this.$router.push({ name: 'usrhome' })
            } catch (error) {
                this.mostrarError('No fue posible cambiar la contraseña')
            }
            finally{
                this.ocultarOcupado()
            }
        }
    },
    computed:{
        ...mapGetters('sesion', ['saludo']),
        erroresPass(){
            let pass = []
            if(!this.$v.form.pass.$dirty){ return pass }
            if(!this.$v.form.pass.required){ pass.push('Ingresa tu contraseña.') }
            if(!this.$v.form.pass.minLength){ pass.push('Ingresa al menos 6 caracteres') }
            if(!this.$v.form.pass.maxLength){ pass.push('Ingresa maximo 20 caracteres') }
            return pass
        },
        erroresPass2(){
            let pass2 = []
            if(!this.$v.form.pass2.$dirty){ return pass2 }
            if(!this.$v.form.pass2.sameAs){ pass2.push('Las contraseñas no coinciden.') }
            return pass2
        },
    },
    created() {
        this.validate()
    }
}
</script>
