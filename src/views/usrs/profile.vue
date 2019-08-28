<template>
  <v-layout text-xs-center align-start justify-center>
    <v-flex xs12 sm10 md6 lg8 xl4>
    <template>
      <v-expansion-panel>
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Datos personales</div>
          </template>
          <template>
            <v-layout text-xs-center align-start justify-center>
              <v-flex xs12>
                <v-card>
                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout row wrap>
                            <v-flex xs12>
                              <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout row wrap>
                            <v-flex xs12>
                              <v-text-field v-model="editedItem.institution" label="Institución"></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout row wrap>  
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.municipality" label="Municipio"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.state" label="Estado"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.country" label="País"></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout row wrap>  
                            <v-flex xs12>
                              <v-text-field v-model="editedItem.phone" label="Telefono"></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="update">Guardar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-data-table class="elevation-1" :headers="headers" :items="user" hide-actions>
                    <template v-slot:items="props">
                      <td>{{ props.item.name }}</td>
                      <td class="text-xs-right">{{ props.item.institution }}</td>
                      <td class="text-xs-right">{{ props.item.municipality }}</td>
                      <td class="text-xs-right">{{ props.item.state }}</td>
                      <td class="text-xs-right">{{ props.item.country }}</td>
                      <td class="text-xs-right">{{ props.item.phone }}</td>
                      <td class="justify-center">
                        <v-icon small @click="editItem(props.item)">edit</v-icon>
                      </td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
           </v-layout>
          </template>
        </v-expansion-panel-content>
        <!--<v-expansion-panel-content>
          <template v-slot:header>
            <div>Comprobante de pago</div>
          </template>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card color="primary">
                  <v-toolbar color="primary" dark card>
                    <v-toolbar-title>
                      Cargar Archivo
                    </v-toolbar-title>        
                  </v-toolbar>
                  <v-card-text>  
                    <template>
                      <img :src="imgURL" width="100%" />
                      <div>
                        <v-btn @click.native="selectFile" v-if="!uploadEnd && !uploading && imgURL == ''">Agregar comprobante de pago
                          <v-icon right aria-hidden="true">add_a_photo</v-icon>
                        </v-btn>
                        <input id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)" />
                        <v-progress-circular v-if="uploading && !uploadEnd" :size="100" :width="15" :rotate="360" :value="progressUpload" color="primary">%</v-progress-circular>
                        <img v-if="uploadEnd" :src="downloadURL" width="100%" />
                        <div v-if="uploadEnd">
                          <v-btn class="ma-0" dark small color="error" @click="deleteImage()">Delete</v-btn>
                        </div>
                      </div>
                    </template>
                  </v-card-text>
                </v-card>
              </v-flex>   
            </v-layout>
        </v-expansion-panel-content>-->
        <v-expansion-panel-content>
          <template v-slot:header>
            <div>Constancia</div>
          </template>
            <div>
            <v-alert :value="true" color="error" icon="warning">
              No hay constancias disponibles  
            </v-alert>
            </div>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="usrType==1">
          <template v-slot:header>
            <div>Inscritos</div>
          </template>
          <template>
            <v-layout text-xs-center align-start justify-center>
              <v-flex xs12>
                <v-card>
                  <v-data-table class="elevation-1" :headers="headers" :items="users" hide-actions>
                    <template v-slot:items="props">
                      <td>{{ props.item.author }}</td>
                      <td class="text-xs-right">{{ props.item.title }}</td>
                      <td class="text-xs-right">{{ props.item.email }}</td>
                      <td class="text-xs-right">{{ props.item.tesisUrl }}</td>
                      <td class="text-xs-right">{{ props.item.testUrl }}</td>
                      <td class="text-xs-right">{{ props.item.ticketUrl }}</td>
                      <td class="text-xs-right">{{ props.item.tesisTopic }}</td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
           </v-layout>
          </template>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="usrType==1">
          <template v-slot:header>
            <div>Revisores</div>
          </template>
          <template>
            <v-layout text-xs-center align-start justify-center>
              <v-flex xs12>
                <v-card>
                  <v-data-table class="elevation-1" :headers="headersReviser" :items="users" hide-actions>
                    <template v-slot:items="props">
                      <td class="text-xs-right">{{ props.item.title }}</td>
                      <td class="text-xs-right">{{ props.item.reviser1 }}</td>
                      <td class="text-xs-right">{{ props.item.reviser2 }}</td>
                      <td class="text-xs-right">{{ props.item.reviser3 }}</td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
           </v-layout>
          </template>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="usrType==0">
          <template v-slot:header>
            <div>Evaluaciones</div>
          </template>
          <template>
            <v-layout text-xs-center align-start justify-center>
              <v-flex xs12>
                <v-card>
                  <v-data-table class="elevation-1" :headers="headersEval" :items="evalInd" hide-actions>
                    <template v-slot:items="props">
                      <td class="text-xs-right">{{ props.item.p1 }}</td>
                      <td class="text-xs-right">{{ props.item.p2 }}</td>
                      <td class="text-xs-right">{{ props.item.p3 }}</td>
                      <td class="text-xs-right">{{ props.item.p4 }}</td>
                      <td class="text-xs-right">{{ props.item.p5 }}</td>
                      <td class="text-xs-right">{{ props.item.p6 }}</td>
                      <td class="text-xs-right">{{ props.item.p7 }}</td>
                      <td class="text-xs-right">{{ props.item.p8 }}</td>
                      <td class="text-xs-right">{{ props.item.p9 }}</td>
                      <td class="text-xs-right">{{ props.item.p10 }}</td>
                      <td class="text-xs-right">{{ props.item.p11 }}</td>
                      <td class="text-xs-right">{{ props.item.p12 }}</td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
           </v-layout>
          </template>
        </v-expansion-panel-content>
        <v-expansion-panel-content v-if="usrType==1">
          <template v-slot:header>
            <div>Descargar datos (.xlsx)</div>
          </template>
          <template>
            <v-btn :loading="loading3" :disabled="loading3" color="success" class="white--text" @click="exportInscritos">
              Inscritos 
            <v-icon right dark>archive</v-icon>
            </v-btn>
            <v-btn :loading="loading3" :disabled="loading3" color="success" class="white--text" @click="exportEvaluaciones">
              Evaluaciones 
            <v-icon right dark>archive</v-icon>
            </v-btn>
          </template>
        </v-expansion-panel-content>  
      </v-expansion-panel>
    </template>
  </v-flex>
  </v-layout>
</template>

<script>
import { auth ,db, storage } from '@/firebase'
import { mapState, mapMutations } from 'vuex'
import XLSX from 'xlsx'
//import store from '@/store'

export default {
    data: () => ({
      usrType: 0,
      dialog: false,
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      imgURL:'',
      downloadURL: '',
      eval:[],
      evalInd:[],
      headers: [
        { text: 'Nombre', align: 'center', sortable: false},
        { text: 'Titulo', align: 'center', sortable: false},
        { text: 'Correo electronico', align: 'center', sortable: false},
        { text: 'Tesis', align: 'center', sortable: false},
        { text: 'Acta', align: 'center', sortable: false},
        { text: 'Comprobante', align: 'center', sortable: false},
        { text: 'Tema', align: 'center', sortable: false},
      ],
      headersReviser: [
        { text: 'Titulo', align: 'center', sortable: true},
        { text: 'Revisor 1', align: 'center', sortable: true},
        { text: 'Revisor 2', align: 'center', sortable: true},
        { text: 'Revisor 3', align: 'center', sortable: true},
      ],
      headersEval:[
        { text: 'Pregunta central clara', align: 'center', sortable: false},
        { text: 'Objetivo justificado', align: 'center', sortable: false},
        { text: 'Presentación del documento', align: 'center', sortable: false},
        { text: 'Originalidad del tema tratado', align: 'center', sortable: false},
        { text: 'Marco teorico', align: 'center', sortable: false},
        { text: 'Métodos', align: 'center', sortable: false},
        { text: 'Resultados y discusión', align: 'center', sortable: false},
        { text: 'Calidad de la tesis', align: 'center', sortable: false},
        { text: 'Relevancía cientifica', align: 'center', sortable: false},
        { text: '¿Existen artículos publicados derivados de la tesis?', align: 'center', sortable: false},
        { text: '¿Es la tesis merecedora de alguno de los primeros lugares?', align: 'center', sortable: false},
        { text: 'Observaciones', align: 'center', sortable: false},
      ],
      user: [],
      users: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        institution: '',
        municipality: '',
        state: '',
        country: '',
        phone: '',
      },
      defaultItem: {
        name: '',
        institution: '',
        municipality: '',
        state: '',
        country: '',
        phone: '',
      }
    }),

    computed: {
      ...mapState('sesion', ['usuario']),
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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

      exportInscritos () { 
        var excelTesis = XLSX.utils.json_to_sheet(this.users) 
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new() // make Workbook of Excel
        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, excelTesis, 'tesis') // sheetAName is name of Worksheet 
        // export Excel file
        XLSX.writeFile(wb, 'tesis.xlsx') // name of the file is 'book.xlsx'
      },

      exportEvaluaciones () { 
        var excelEvaluaciones = XLSX.utils.json_to_sheet(this.eval) 
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new() // make Workbook of Excel
        // add Worksheet to Workbook
        // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, excelEvaluaciones, 'evaluaciones') // sheetAName is name of Worksheet 
        // export Excel file
        XLSX.writeFile(wb, 'evaluaciones.xlsx') // name of the file is 'book.xlsx'
      },
      
      selectFile () {
        this.$refs.uploadInput.click()
      },
    
      detectFiles (e) {
        let fileList = e.target.files || e.dataTransfer.files
        Array.from(Array(fileList.length).keys()).map(x => {
          this.upload(fileList[x])
        })
      },
      
      async updatePay(){
        
      },

      async upload (file) {
        let uid = auth.currentUser.uid
        this.fileName = file.name
        this.uploading = true
        this.uploadTask = storage.ref(`pay/${uid}`).put(file)
        let url = await this.uploadTask.snapshot.ref.getDownloadURL()
        let pago = {pay:1, payURL:url}
        await db.collection('usr').doc(uid).update(pago)
      },
      
      deleteImage () {
        let uid = auth.currentUser.uid
        storage.ref(`pay/${uid}`).delete().then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
        })
        .catch((error) => {
          
        })
      },

      async consultarUsuario(){
        let uid = auth.currentUser.uid
        await db.collection('usr').doc(uid).get().then(doc => {
         if(doc.data().usrType == 1)
            this.usrType = 1
        })
      },

      async consultarIMG(){
        let uid = auth.currentUser.uid
        let doc = await db.collection('usr').doc(uid).get()
        this.user.push(doc.data())
        let auxUsr = this.user[0]
        this.imgURL = auxUsr.payURL
      },

      async consultarEvaluaciones(){
        let docs = await db.collection('eval').get()
        docs.forEach(doc => {
              this.eval.push(doc.data())
          })
      },  

      async consultarEvalInd(){
        let uid = auth.currentUser.uid
        let docs = await db.collection('eval').get()
        docs.forEach(doc => {
          if(uid == doc.data().usrTesisId)
              this.evalInd.push(doc.data())
          })
      }, 

      async consultarInscritos(){
        let docs = await db.collection('tesis').get()
        docs.forEach(doc => {
              this.users.push(doc.data())
          })
        /*this.users.forEach(doc2 => {
          if(doc2.tesisUrl != "")
            doc2.tesisUrl = 'Cargado'
          else
            doc2.tesisUrl = 'Falta'
          if(doc2.testUrl != "")
            doc2.testUrl = 'Cargado'
          else
            doc2.testUrl = 'Falta'
          if(doc2.ticketUrl != "")
            doc2.ticketUrl = 'Cargado' 
          else
            doc2.ticketUrl = 'Falta'     
        })*/
      },

      initialize () {
        this.consultarUsuario()
        this.consultarIMG()
        this.user = []
        this.users = []
        this.consultarInscritos()
        this.consultarEvaluaciones()
        this.consultarEvalInd()
      },

      editItem (item) {
        this.editedIndex = this.user.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async update () {
        this.mostrarOcupado({ titulo: 'Actualizando', mensaje: 'Espere mientras actualizamos su entrada...' })
        let uid = auth.currentUser.uid
        let perfil = {
            name:this.editedItem.name,
            institution:this.editedItem.institution,
            municipality:this.editedItem.municipality,
            state:this.editedItem.state,
            country:this.editedItem.country,
            phone:this.editedItem.phone
        }
        await db.collection('usr').doc(uid).update(perfil)
        this.ocultarOcupado()
        this.mostrarExito('Perfil actualizado')
        this.close()
        this.initialize()
      }
    }
}
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
input[type="file"] {
  position: absolute;
  clip: rect(0,0,0,0);
}
</style>