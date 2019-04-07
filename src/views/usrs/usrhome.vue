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
                    <v-dialog v-model="dialog" max-width="700px">
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
                                    <v-layout row wrap>
                                        <v-flex xs6>
                                            <v-combobox v-model="select1" :items="opciones1" label="Modalidad"></v-combobox>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-combobox v-model="select2" :items="opciones2" label="Tema"></v-combobox>
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
                                    <!--<v-layout row wrap>
                                        <v-flex xs12>
                                            <markdown-editor v-model="editedItem.content" ref="markdownEditor"></markdown-editor>
                                        </v-flex>   
                                    </v-layout>-->
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-card color="primary">
                                              <v-toolbar color="primary" dark card>
                                                <v-toolbar-title>
                                                  Cargar Archivo
                                                </v-toolbar-title>        
                                              </v-toolbar>
                                              <v-card-text>  
                                                <v-btn @click.native="selectFile" v-if="!uploadEnd && !uploading"> Subir archivo </v-btn>
                                                {{ fileName }}
                                                <input style="display: none" id="files" type="file" name="file" ref="uploadInput" accept=".pdf" :multiple="false" @change="detectFiles($event)" />
                                              </v-card-text>
                                            </v-card>
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

                    <v-dialog v-model="dialogView">
                      <template>
                        <v-card>
                        <v-card-text>
                        <pdf src="https://sci2s.ugr.es/sites/default/files/files/Teaching/GraduatesCourses/Bioinformatica/Tema%2006%20-%20AGs%20I.pdf" :page="1">
                        </pdf>
                        </v-card-text>
                        </v-card>
                      </template>
                    </v-dialog>
                    
                    <v-data-table :headers="headers" :items="abstracts" hide-actions :pagination.sync="pagination" class="elevation-1">
                        <template v-slot:items="props">
                            <td class="justify-center"><v-checkbox v-model="props.selected" primary hide-details></v-checkbox></td>
                            <td class="text-xs-center">{{ props.item.title }}</td>
                            <td class="text-xs-center">{{ props.item.id }}</td>
                            <td class="justify-center">
                                <v-icon small @click="dialogView=true">visibility</v-icon>
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
  import { auth ,db, storage } from '@/firebase'
  import { mapMutations } from 'vuex'
  import uuidv4 from 'uuid/v4'
  import pdf from 'pdfvuer'

  export default {
    components: {
      pdf
    },
    data: () => ({
      dialog: false,
      dialogView: false,
      pagination: {},
      guardar: false,
      progressUpload: 0,
      filePdf: null,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      user: '',
      opciones1: [
        'Contribución oral',
        'Cartel',
        'Simposio'
      ],
      opciones2: [
        'Anatomía',
        'Biogeografía',
        'Bioquimica',
        'Briología',
        'Conservación',
        'Ecología',
        'Etnobotánica',
        'Evolución',
        'Ficología',
        'Filogeografía',
        'Fisiología',
        'Fitoquímica',
        'Floristica',
        'Genética',
        'Historia',
        'Liquenología',
        'Micología',
        'Morfología',
        'Nomenclatura',
        'Palinología',
        'Sistematica filogenética',
        'Taxonomía'
      ],
      headers: [
        { text: 'Aceptación', align: 'center', sortable: false,},
        { text: 'Titulo', align: 'center', sortable: true, value: 'title'},
        { text: 'Autor', align: 'center', value: 'author', sortable: false },
        { text: 'Acciones', value: 'title', sortable: false }
      ],
      abstracts: [],
      editedIndex: -1,
      editedItem: {
        id:'',
        author:'',
        title:'',
        coauthor1:'',
        coauthor2:'',
        keyword1:'',
        keyword2:'',
        keyword3:'',
        keyword4:'',
        keyword5:'',
        content:'',
        file:''
      },
      defaultItem: {
        id:'',
        author:'',
        title:'',
        coauthor1:'',
        coauthor2:'',
        keyword1:'',
        keyword2:'',
        keyword3:'',
        keyword4:'',
        keyword5:'',
        content:'',
        file:''
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
      },
      uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      },
      null,
      () => {
        this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.uploadEnd = true
          this.downloadURL = downloadURL
          this.$emit('downloadURL', downloadURL)
        })
      })
    }
    },

    created () {
      this.initialize()
    },

    methods: {
      ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarError','mostrarAdvertencia']),
      //...mapMutations('sesion', ['actualizarUsuario']),

      selectFile () {
        this.$refs.uploadInput.click()
      },
      detectFiles (e) {
        this.filePdf = e.target.files || e.dataTransfer.files
        this.fileName = this.filePdf[0].name
        //this.mostrarExito(this.filePdf[0].name)
        //Array.from(Array(this.filePdf.length).keys()).map(x => {
          //this.upload(fileList[x])
        //})
      },  
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

      async editItem (item) {
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        let uid = auth.currentUser.uid
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        let ref = this.editedItem.id
        storage.ref(`abstracts/${uid}/${ref}.pdf`).delete()
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
        this.mostrarOcupado({ titulo: 'Guardando', mensaje: 'Espere mientras guardamos su entrada...' })
        let uid = auth.currentUser.uid 
        let archivoId = uuidv4()
        try {
          this.uploading = true
          this.uploadTask = await storage.ref(`abstracts/${uid}/${archivoId}.pdf`).put(this.filePdf[0])
          let url = await this.uploadTask.ref.getDownloadURL()
          let resumen = {
            uid,  
            id: archivoId,
            author: '',
            title: this.editedItem.title,
            coauthor1: this.editedItem.coauthor1,
            coauthor2: this.editedItem.coauthor2,
            keyword1: this.editedItem.keyword1,
            keyword2: this.editedItem.keyword2,
            keyword3: this.editedItem.keyword3,
            keyword4: this.editedItem.keyword4,
            keyword5: this.editedItem.keyword5,
            content: this.editedItem.content,
            file: url,
            date: new Date()
        }
        await db.collection('abstract').doc(archivoId).set(resumen)//.then(ref => {this.addID(ref.id)})
        this.mostrarExito('Entrada registrada')
        this.close()
        this.initialize()
      }
      catch (error) {
        this.mostrarError(error)
      }
      finally {
        this.ocultarOcupado()
      }
      },

      async update () {
        this.mostrarOcupado({ titulo: 'Actualizando', mensaje: 'Espere mientras actualizamos su entrada...' })
        let ref = this.editedItem.id
        let uid = auth.currentUser.uid
        this.uploading = true
        this.uploadTask = await storage.ref(`abstracts/${uid}/${ref}.pdf`).put(this.filePdf[0])
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
        await db.collection('abstract').doc(ref).update(resumen)
        this.ocultarOcupado()
        this.mostrarExito('Entrada actualizada')
        this.close()
        this.initialize()
      }
    }
  }
</script>
