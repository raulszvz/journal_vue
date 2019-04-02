<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm10 md6 lg8 xl4>
        <v-card>
            <template>
                <div>
                    <v-toolbar flat color="white">
                    <v-toolbar-title>Resumenes</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Agregar</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container grid-list-md>
                                     <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field label="Titulo" v-model="editedItem.title"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs6>
                                            <v-text-field label="Coautor" v-model="editedItem.coauthor1"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field label="Coautor" v-model="editedItem.coauthor2"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap  align-center justify-space-between fill-height>
                                        <v-flex xs2>
                                            <v-text-field label="Palabra clave" v-model="editedItem.keyword1"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-text-field label="Palabra clave" v-model="editedItem.keyword2"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-text-field label="Palabra clave" v-model="editedItem.keyword3"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-text-field label="Palabra clave" v-model="editedItem.keyword4"></v-text-field>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-text-field label="Palabra clave" v-model="editedItem.keyword5"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <markdown-editor v-model="editedItem.content" ref="markdownEditor"></markdown-editor>
                                        </v-flex>   
                                    </v-layout>

                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" v-if="!guardar" flat @click="save">Guardar</v-btn>
                                <v-btn color="blue darken-1" v-else-if="guardar" flat @click="update">Actualizar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    </v-toolbar>
                    
                    <v-data-table :headers="headers" :items="abstracts" hide-actions :pagination.sync="pagination" class="elevation-1">
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.title }}</td>
                            <td class="text-xs-center">{{ props.item.date }}</td>
                            <td class="text-xs-center">{{ props.item.id }}</td>
                            <td class="justify-center">
                                <!--<v-icon small @click="editItem(props.item)">visibility</v-icon>-->
                                <v-icon small @click="editItem(props.item), guardar=true">edit</v-icon>
                                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                            </td>
                        </template>
                        <template v-slot:no-data>
                            <!--<v-btn color="primary" @click="initialize">Reset</v-btn>
                            <v-alert :value="true" color="error" icon="warning">Aún no se han creado datos en esta cuenta</v-alert>-->
                        </template>
                    </v-data-table>
                    <div class="text-xs-center pt-2">
                        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                    </div>
                </div>
            </template>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { auth, db } from '@/firebase'

  export default {
    data: () => ({
      dialog: false,
      pagination: {},
      guardar: false,
      headers: [
        { text: 'Titulo', align: 'center', sortable: true, value: 'title'},
        { text: 'Fecha', align: 'center', value: 'date', sortable: false },
        { text: 'Autor', align: 'center', value: 'author', sortable: false },
        { text: 'Acciones', value: 'title', sortable: false }
      ],
      abstracts: [],
      editedIndex: -1,
      editedItem: {
        id:'',
        title:'',
        coauthor1:'',
        coauthor2:'',
        keyword1:'',
        keyword2:'',
        keyword3:'',
        keyword4:'',
        keyword5:'',
        content:''
      },
      defaultItem: {
        id:'',
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
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
      },
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarError','mostrarAdvertencia']),
      //...mapMutations('sesion', ['actualizarUsuario']),

      async consultarResumen(){
        let docs = await db.collection('abstract').get()
        docs.forEach(doc => {
          this.abstracts.push(doc.data())
        })
        if (this.abstracts.length == 0) {
          this.mostrarAdvertencia('No hay resumenes guardados')
        }
      },

      initialize () {
        this.consultarResumen()
        this.abstracts = []
      },

      editItem (item) {
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        //const index = this.abstracts.indexOf(item)
        //confirm('¿Esta seguro de borrar esta entrada?') && this.abstracts.splice(index, 1)
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        let ref = this.editedItem.id
        db.collection("abstract").doc(ref).delete()
        this.mostrarExito('Entrada borrada')
        this.initialize()
      },

      close () {
        this.dialog = false
      },

      async addID(id){
          await db.collection('abstract').doc(id).update({id:id})
      },

      async save () {
        let uid = auth.currentUser.uid 
        let resumen = {
            uid,  
            id:'',
            title: this.editedItem.title,
            coauthor1: this.editedItem.coauthor1,
            coauthor2: this.editedItem.coauthor2,
            keyword1: this.editedItem.keyword1,
            keyword2: this.editedItem.keyword2,
            keyword3: this.editedItem.keyword3,
            keyword4: this.editedItem.keyword4,
            keyword5: this.editedItem.keyword5,
            content: this.editedItem.content,
            date: new Date()
             
        }
        this.mostrarExito('Punto previo')
        await db.collection('abstract').add(resumen)
        .then(ref => {this.addID(ref.id)})
        this.mostrarExito('Entrada registrada')
        this.close()
        this.initialize()
      },

      async update () {
        let resumen = {
            title: this.editedItem.title,
            coauthor1: this.editedItem.coauthor1,
            coauthor2: this.editedItem.coauthor2,
            keyword1: this.editedItem.keyword1,
            keyword2: this.editedItem.keyword2,
            keyword3: this.editedItem.keyword3,
            keyword4: this.editedItem.keyword4,
            keyword5: this.editedItem.keyword5,
            content: this.editedItem.content,
            date: new Date()
             
        }
        let ref = this.editedItem.id
        await db.collection('abstract').doc(ref).update(resumen)
        this.mostrarExito('Entrada actualizada')
        this.close()
        this.initialize()
      }
    }
  }
</script>