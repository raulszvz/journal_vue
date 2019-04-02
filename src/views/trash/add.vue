<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Nuevo resumen
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field label="Titulo" v-model="form.title" :error-messages="erroresTitle" @blur="$v.form.title.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-text-field label="Coautor" v-model="form.coauthor1" :error-messages="erroresCoauthor1" @blur="$v.form.coauthor1.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field label="Coautor" v-model="form.coauthor2" :error-messages="erroresCoauthor2" @blur="$v.form.coauthor2.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap  align-center justify-space-between fill-height>
                    <v-flex xs2>
                        <v-text-field label="Palabra clave" v-model="form.keyword1" :error-messages="erroresKeyword1" @blur="$v.form.keyword1.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-text-field label="Palabra clave" v-model="form.keyword2" :error-messages="erroresKeyword2" @blur="$v.form.keyword2.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-text-field label="Palabra clave" v-model="form.keyword3" :error-messages="erroresKeyword3" @blur="$v.form.keyword3.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-text-field label="Palabra clave" v-model="form.keyword4" :error-messages="erroresKeyword4" @blur="$v.form.keyword4.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-text-field label="Palabra clave" v-model="form.keyword5" :error-messages="erroresKeyword5" @blur="$v.form.keyword5.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12>
                        <markdown-editor v-model="form.content" :error-messages="erroresContent" @blur="$v.form.content.$touch()" ref="markdownEditor"></markdown-editor>
                    </v-flex>   
                </v-layout>
                <v-layout row wrap>
                    <v-flex>
                        <v-btn @click="save" :depressed="$v.form.$invalid" :disabled="$v.form.$invalid" color="secondary">Guardar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import markdownEditor from 'vue-simplemde/src/markdown-editor'
  import { required } from 'vuelidate/lib/validators'

  export default {
    components: {
      markdownEditor
    },
    data() {
      return {
        form: {
          title:'',
          coauthor1:'',
          coauthor2:'',
          keyword1:'',
          keyword2:'',
          keyword3:'',
          keyword4:'',
          keyword5:'',
          content:''
        }
      }
    },
    validations:{
      form: {
        title:{
          required
        },
        coauthor1:{
          
        },
        coauthor2:{
          
        },
        keyword1:{
          required
        },
        keyword2:{
          required
        },
        keyword3:{
          
        },
        keyword4:{
          
        },
        keyword5:{
    
        },
        content:{
          required
        }
      }
    },
    methods: {
      save(){
        if(this.$v.form.$invalid){ 
          this.$v.form.$touch()
          return 
        }
        alert('Guardado')
      }
    },
    computed: {
      erroresTitle(){
        let errores = []
        if(!this.$v.form.title.$dirty){ return errores }
        if(!this.$v.form.title.required){ errores.push('Ingresa el titulo.') }
        return errores
      },
      erroresKeyword1(){
        let errores = []
        if(!this.$v.form.keyword1.$dirty){ return errores }
        if(!this.$v.form.keyword1.required){ errores.push('Ingresa palabra clave.') }
        return errores
      },
      erroresKeyword2(){
        let errores = []
        if(!this.$v.form.keyword2.$dirty){ return errores }
        if(!this.$v.form.keyword2.required){ errores.push('Ingresa palabra clave.') }
        return errores
      },
      erroresContent(){
        let errores = []
        if(!this.$v.form.content.$dirty){ return errores }
        if(!this.$v.form.content.required){ errores.push('Ingresa contenido.') }
        return errores
      }
    }
  }
</script>

<style>
  @import '~simplemde/dist/simplemde.min.css';
</style>