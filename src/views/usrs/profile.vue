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
        <v-expansion-panel-content>
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
                        <!--<div v-if="uploadEnd">
                          <v-btn class="ma-0" dark small color="error" @click="deleteImage()">Delete</v-btn>
                        </div>-->
                      </div>
                    </template>
                  </v-card-text>
                </v-card>
              </v-flex>   
            </v-layout>
        </v-expansion-panel-content>
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
      </v-expansion-panel>
    </template>
  </v-flex>
  </v-layout>
</template>

<script>
import { auth ,db, storage } from '@/firebase'
import { mapState, mapMutations } from 'vuex'
//import store from '@/store'

export default {
    data: () => ({
      dialog: false,
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      imgURL:'',
      downloadURL: '',
      headers: [
        { text: 'Nombre', align: 'center', sortable: false, value: 'name'},
        { text: 'Institución', align: 'center', sortable: false, value: 'institution'},
        { text: 'Municipio', align: 'center', sortable: false, value: 'municipality'},
        { text: 'Estado', align: 'center', sortable: false, value: 'state'},
        { text: 'País', align: 'center', sortable: false, value: 'country'},
        { text: 'Telefono', align: 'center', sortable: false, value: 'phone'},
        { text: 'Editar', value: 'name', sortable: false }
      ],
      user: [],
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

      async consultarIMG(){
        let uid = auth.currentUser.uid
        let doc = await db.collection('usr').doc(uid).get()
        this.user.push(doc.data())
        let auxUsr = this.user[0]
        this.imgURL = auxUsr.payURL
      },

      initialize () {
        this.consultarIMG()
        this.user = []
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