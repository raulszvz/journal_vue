<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm10 md6 lg8 xl4>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Regístrate
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
                    <v-flex xs6>
                        <v-text-field label="Contraseña" v-model="form.pass" :error-messages="erroresPass" @blur="$v.form.pass.$touch()" type="password"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field label="Repetir contraseña" v-model="form.pass2" :error-messages="erroresPass2" @blur="$v.form.pass2.$touch()" type="password"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Nombre (con apellidos)" v-model="form.name" :error-messages="erroresName" @blur="$v.form.name.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Institución" v-model="form.institution" :error-messages="erroresInstitution" @blur="$v.form.institution.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-combobox v-model="form.grado" :items="opciones" label="Grado"></v-combobox>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs4>
                        <v-text-field label="Municipio" v-model="form.municipality" :error-messages="erroresMunicipality" @blur="$v.form.municipality.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-text-field label="Estado" v-model="form.state" :error-messages="erroresState" @blur="$v.form.state.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-text-field label="Pais" v-model="form.country" :error-messages="erroresCountry" @blur="$v.form.country.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Telefono" @keyup.enter="login" v-model="form.phone" :error-messages="erroresPhone" @blur="$v.form.phone.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex>
                        <v-btn @click="signIn" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid" color="secondary">Enviar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap>
                    <v-flex>
                      <v-btn :to="{ name: 'login' }" flat color="info">¿Ya tienes cuenta? Ingresa.</v-btn>
                    </v-flex>
                </v-layout>
          </v-card-actions>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { mapMutations, mapGetters } from 'vuex'
import { auth, db } from '@/firebase'

export default {
  data() {
    return {
      opciones: [
        'Licenciatura',
        'Especialidad',
        'Maestria',
        'Doctorado'
      ],
      form: {
        email:'',
        pass:'',
        pass2:'',
        name:'',
        institution:'',
        grado:'',
        municipality:'',
        state:'',
        country:'',
        phone:''
      }
    }
  },
  validations:{
    form: {
      email:{
        required,
        email
      },
      pass:{
        required,
        minLength:minLength(6),
        maxLength:maxLength(20)
      },
      pass2:{
        sameAs: sameAs('pass')
      },
      name:{
        required
      },
      institution:{
        required
      },
      grado:{
        required
      },
      municipality:{
        required
      },
      state:{
        required
      },
      country:{
        required
      },
      phone:{
        required
      }
    }
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarError','mostrarAdvertencia']),
    ...mapMutations('sesion', ['actualizarUsuario']),
    async signIn() {
      try {
        this.mostrarOcupado({ titulo: 'Creando Registro', mensaje: 'Estamos registrando tu información...' })

        let uid = null

        if(auth.currentUser) {
          uid = auth.currentUser.uid
        }
        else {
          let cred = await auth.createUserWithEmailAndPassword(this.form.email, this.form.pass)
          uid = cred.user.uid
        }

        await this.guardarUsuario(uid)

        await auth.currentUser.sendEmailVerification()
        
        this.$router.push({ name: 'emailVerification' })
      }
      catch (error) {

        switch (error.code) {
          case 'auth/email-already-in-use':
            this.mostrarAdvertencia('Ya se ha registrado esta dirección de email con anterioridad')
            break

          default:
            this.mostrarError('Ocurrió un error registrando tu cuenta. Inténtalo más tarde.')
            break
        }
      }
      finally {
        this.ocultarOcupado()
      }
    },
    async guardarUsuario(uid) {
      let usuario = {
          uid,
          name: this.form.name,
          institution: this.form.institution,
          grado: this.form.grado,
          municipality: this.form.municipality,
          state: this.form.state,
          country: this.form.country,
          phone: this.form.phone,
          usrType: 0    
      }

        await db.collection('usr')
                .doc(usuario.uid)
                .set(usuario)

        this.actualizarUsuario(usuario)
        this.mostrarExito(this.saludo)
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
    erroresName(){
      let name = []
      if(!this.$v.form.name.$dirty){ return name }
      if(!this.$v.form.name.required){ name.push('Ingresa tu nombre (con apellidos).') }
      return name
    },
    erroresInstitution(){
      let institution = []
      if(!this.$v.form.institution.$dirty){ return institution }
      if(!this.$v.form.institution.required){ institution.push('Ingresa tu institución.') }
      return institution
    },
    erroresMunicipality(){
      let municipality = []
      if(!this.$v.form.municipality.$dirty){ return municipality }
      if(!this.$v.form.municipality.required){ municipality.push('Ingresa tu municipio.') }
      return municipality
    },
    erroresState(){
      let state = []
      if(!this.$v.form.state.$dirty){ return state }
      if(!this.$v.form.state.required){ state.push('Ingresa tu estado.') }
      return state
    },
    erroresCountry(){
      let country = []
      if(!this.$v.form.country.$dirty){ return country }
      if(!this.$v.form.country.required){ country.push('Ingresa tu país.') }
      return country
    },
    erroresPhone(){
      let phone = []
      if(!this.$v.form.phone.$dirty){ return phone }
      if(!this.$v.form.phone.required){ phone.push('Ingresa tu número telefonico.') }
      return phone
    }
  }
}
</script>