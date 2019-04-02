<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Ingresar
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Email" v-model="form.email" :error-messages="erroresEmail" @blur="$v.form.email.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Password" @keyup.enter="login" v-model="form.password" :error-messages="erroresPassword" @blur="$v.form.password.$touch()" type="password" ></v-text-field>
                    </v-flex>   
                </v-layout>
                <v-layout row wrap>
                    <v-flex>
                        <v-btn @click="login" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid" color="secondary">Entrar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn @click="rememberPass = true" flat color="info">¿Olvidaste tu contraseña?</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn :to="{ name: 'signIn' }" flat color="info">¿No tienes cuenta? Regístrate.</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="rememberPass" max-width="400" persistent>
          <v-card>
            <v-toolbar color="primary" dark card>
              <v-toolbar-title>
                Restablecer constraseña
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="subheading">
            Ingresa la dirección de email con la cual te registraste.
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Email" v-model="emailSend" :error-messages="erroresEmailSend" @blur="$v.emailSend.$touch()"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout>
              <v-flex xs6>
                <v-layout justify-start>
                  <v-btn @click="rememberPass = false">Cancelar</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout justify-end>
                  <v-btn color="secondary" @click="sendPass" :depressed="$v.emailSend.$invalid" :disabled="$v.emailSend.$invalid">Enviar</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>

          </v-card>
        </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapGetters } from 'vuex'
import { auth } from '@/firebase'

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rememberPass: false,
      emailSend: ''
    }
  },
  validations:{
    form: {
      email:{
        required,
        email
      },
      password:{
        required,
        minLength:minLength(6),
        maxLength:maxLength(20)
      }
    },
    emailSend: {
      required,
      email
    }
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarAdvertencia']),
    ...mapMutations('sesion', ['actualizarUsuario']),
    async login(){
      if(this.$v.form.$invalid){ 
        this.$v.form.$touch()
        return 
        }
      
      let ocupado = {
        titulo: 'Validando Credenciales',
        mensaje: 'Estamos validando tu información...'
      }

      this.mostrarOcupado(ocupado)
      try{
        await auth.signInWithEmailAndPassword(this.form.email, this.form.password)
      }
      catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.mostrarAdvertencia('Usuario no válido. Revisa tu correo y contraseña.')
            break

          default:
            this.mostrarError('Ocurrió un error validando la información.')
            break
        }
      }
      finally {
        this.ocultarOcupado()
      }
    },
    async sendPass(){
      this.remeberPass = false
      this.mostrarOcupado({ titulo: 'Enviando solicitud', mensaje: 'Enviando solicitud de restablecimiento de contraseña.' })
      try {
        await auth.sendPasswordResetEmail(this.emailSend)
        this.mostrarExito('Se ha enviado la solicitud de restablecimiento de contraseña.')
      } catch (error) {
        this.mostrarError('Ocurrió un error enviando la solicitud.')
      }
      finally{
        this.ocultarOcupado()
      }
    }
  },
  computed: {
    ...mapGetters('sesion', ['saludo']),
    erroresEmail(){
      let errores = []
      if(!this.$v.form.email.$dirty){ return errores }
      if(!this.$v.form.email.required){ errores.push('Ingresa tu email.') }
      if(!this.$v.form.email.email){ errores.push('Ingresa un email valido.') }
      return errores
    },
    erroresPassword(){
      let password = []
      if(!this.$v.form.password.$dirty){ return password }
      if(!this.$v.form.password.required){ password.push('Ingresa tu contraseña.') }
      if(!this.$v.form.password.minLength){ password.push('Ingresa al menos 6 caracteres') }
      if(!this.$v.form.password.maxLength){ password.push('Ingresa maximo 20 caracteres') }
      return password
    },
    erroresEmailSend(){
      let errores = []
      if(!this.$v.emailSend.$dirty){ return errores }
      if(!this.$v.emailSend.required){ errores.push('Ingresa tu email.') }
      if(!this.$v.emailSend.email){ errores.push('Ingresa un email valido.') }
      return errores
    },
  }
}
</script>