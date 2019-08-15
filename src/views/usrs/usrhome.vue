<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm10 md6 lg8 xl4>
        <v-card>
            <template>
                <div>
                    <v-toolbar flat color="white">
                    <v-toolbar-title>Tesis</v-toolbar-title>
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
                                        <v-flex xs12>
                                            <v-text-field label="Nombre del director de tesís" v-model="editedItem.principal"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field label="Certamenes anteriores en los que ha participado la tesis" v-model="editedItem.competition"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="editedItem.start" lazy transition="scale-transition" offset-y full-width min-width="290px">
                                              <template v-slot:activator="{ on }">
                                                <v-text-field v-model="editedItem.start" label="Fecha de inicio de tesis" prepend-icon="event" readonly v-on="on"></v-text-field>
                                              </template>
                                              <v-date-picker v-model="editedItem.start" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.menu.save(editedItem.start)">OK</v-btn>
                                              </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-menu ref="menuEnd" v-model="menuEnd" :close-on-content-click="false" :nudge-right="40" :return-value.sync="editedItem.end" lazy transition="scale-transition" offset-y full-width min-width="290px">
                                              <template v-slot:activator="{ on }">
                                                <v-text-field v-model="editedItem.end" label="Fecha de inicio de tesis" prepend-icon="event" readonly v-on="on"></v-text-field>
                                              </template>
                                              <v-date-picker v-model="editedItem.end" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="menuEnd = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs.menuEnd.save(editedItem.end)">OK</v-btn>
                                              </v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-text-field label="Articulos derivados de la tesis (indicar DOI o sitio web de descarga" v-model="editedItem.articleRef"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-card color="primary">
                                              <v-toolbar color="primary" dark card>
                                                <v-toolbar-title>
                                                  Tesís
                                                </v-toolbar-title>        
                                              </v-toolbar>
                                              <v-card-text>  
                                                <v-btn @click.native="selectFile" v-if="!uploadEnd && !uploading"> Cargar archivo </v-btn>
                                                {{ fileName }}
                                                <input style="display: none" id="files" type="file" name="file" ref="uploadInput" accept=".pdf" :multiple="false" @change="detectFiles($event)" />
                                              </v-card-text>
                                            </v-card>
                                        </v-flex>   
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-card color="primary">
                                              <v-toolbar color="primary" dark card>
                                                <v-toolbar-title>
                                                  Acta de examen
                                                </v-toolbar-title>        
                                              </v-toolbar>
                                              <v-card-text>  
                                                <v-btn @click.native="selectFile2" v-if="!uploadEnd && !uploading"> Cargar archivo </v-btn>
                                                {{ fileName2 }}
                                                <input style="display: none" id="files" type="file" name="file2" ref="uploadInput2" accept=".pdf" :multiple="false" @change="detectFiles2($event)" />
                                              </v-card-text>
                                            </v-card>
                                        </v-flex>   
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-card color="primary">
                                              <v-toolbar color="primary" dark card>
                                                <v-toolbar-title>
                                                  Comprobante de membresía a la SBM o ficha de pago
                                                </v-toolbar-title>        
                                              </v-toolbar>
                                              <v-card-text>  
                                                <v-btn @click.native="selectFile3" v-if="!uploadEnd && !uploading"> Cargar archivo </v-btn>
                                                {{ fileName3 }}
                                                <input style="display: none" id="files" type="file" name="file3" ref="uploadInput3" accept="" :multiple="false" @change="detectFiles3($event)" />
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

                    <v-dialog v-model="dialogView" max-width="700px">
                      <template>
                        <v-card>
                        <v-card-text>
                          <v-container grid-list-md>
                            <p><b>Evaluación por sección</b></p>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Pregunta central clara:</p>
                                <v-radio-group v-model="uno" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Objetivo justificado:</p>
                                <v-radio-group v-model="dos" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Presentación del documento:</p>
                                <v-radio-group v-model="tres" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Originalidad del tema tratado:</p>
                                <v-radio-group v-model="cuatro" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Marco teorico:</p>
                                <v-radio-group v-model="cinco" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Métodos:</p>
                                <v-radio-group v-model="seis" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Resultados y discusión:</p>
                                <v-radio-group v-model="siete" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                          </v-container>
                          <v-container grid-list-md>
                            <p><b>Evaluación global</b></p>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Calidad de la tesis:</p>
                                <v-radio-group v-model="ocho" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <p>Relevancía cientifica:</p>
                                <v-radio-group v-model="nueve" row>
                                  <v-radio label="Excelente" value="Excelente"></v-radio>
                                  <v-radio label="Bueno" value="Bueno"></v-radio>
                                  <v-radio label="Regular" value="Regular"></v-radio>
                                  <v-radio label="Malo" value="Malo"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                          </v-container>
                          <v-container grid-list-md>
                            <v-flex xs12>
                              <v-textarea label="¿Existen artículos publicados derivados de la tesis?" v-model="diez"></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                              <v-textarea label="¿Es la tesis merecedora de alguno de los primeros lugares? Argumente las características de la tesis que la hace merecedora de tal lugar." v-model="once"></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                              <v-textarea label="Observaciones adicionales que deben ser tomadas en cuenta para considerar esta tesis entre las ganadoras:" v-model="doce"></v-textarea>
                            </v-flex>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>  
                          <v-btn color="blue darken-1" v-if="cal" flat @click="evaluacion">Guardar</v-btn>
                          <v-btn color="red darken-1" v-if="cal" flat @click="close">Cancelar</v-btn>
                        </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>

                    <v-dialog v-model="dialogTema" max-width="700px">
                      <v-card>
                        <v-card-text>
                          <v-container grid-list-md>
                            <p><b>Asignación de tema</b></p>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <v-combobox v-model="topic" :items="temas" label="Tema"></v-combobox>    
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue darken-1" v-if="cal" flat @click="tesisTopicUpdate">Guardar</v-btn>
                          <v-btn color="red darken-1" v-if="cal" flat @click="dialogTema=false">Cancelar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog> 

                    <v-dialog v-model="dialogRevisor" max-width="700px">
                      <v-card>
                        <v-card-text>
                          <v-container grid-list-md>
                            <p><b>Asignación de revisores</b></p>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <v-combobox v-model="rev1" :items="revNAME" label="Revisor 1"></v-combobox>    
                              </v-flex>
                              <v-flex xs12>
                                <v-combobox v-model="rev2" :items="revNAME" label="Revisor 2"></v-combobox>    
                              </v-flex>
                              <v-flex xs12>
                                <v-combobox v-model="rev3" :items="revNAME" label="Revisor 3"></v-combobox>    
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue darken-1" v-if="cal" flat @click="reviserUpdate">Guardar</v-btn>
                          <v-btn color="red darken-1" v-if="cal" flat @click="dialogRevisor=false">Cancelar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog> 

                    <!--<v-data-table :headers="headers" :items="abstracts" hide-actions :pagination.sync="pagination" class="elevation-1">-->
                    <v-data-table :headers="headers" :items="abstracts" hide-actions  class="elevation-1">  
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.title }}</td>
                            <td class="text-xs-center">{{ props.item.author }}</td>
                            <td class="justify-center">
                                <v-icon small v-if="usrType==1" @click="editItemTopic(props.item)">assignment</v-icon>
                                <v-icon small v-if="usrType==1" @click="editItemTopic(props.item), dialogRevisor=true, dialogTema=false">assignment_ind</v-icon>
                                <v-icon small v-if="usrType==1 || usrType==2" @click="editItemEval(props.item)">check_box</v-icon>
                                <v-icon small v-if="usrType==0" @click="editItem(props.item), guardar=true">edit</v-icon>
                                <v-icon small v-if="usrType==0" @click="deleteItem(props.item)">delete</v-icon>
                                <v-icon small @click="linkTesis(props.item)">visibility</v-icon>
                                <v-icon small @click="linkTest(props.item)">visibility</v-icon>
                                <v-icon small @click="linkTicket(props.item)">visibility</v-icon>
                            </td>
                        </template>
                        <template v-slot:no-data>
                          <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here :(</v-alert>
                          <!--<v-btn color="primary" @click="initialize">Reset</v-btn>-->
                        </template>
                    </v-data-table>
                    <!--<div class="text-xs-center pt-2">
                        <v-pagination v-model="pagination.page" :length=1></v-pagination>
                    </div>-->
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
  import nodemailer from 'nodemailer'
  //let nodemailer = require('nodemailer')

  export default {
    components: {
      pdf
    },
    data: () => ({
      topic: '',
      usrType: '',
      nameCurrentUsr:'',
      dialog: false,
      dialogView: false,
      dialogTema: false,
      dialogRevisor: false,
      pagination: {},
      guardar: false,
      cal: true,
      progressUpload: 0,
      filePdf: null,
      fileName: '',
      filePdf2: null,
      fileName2: '',
      filePdf3: null,
      fileName3: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      user: '',
      pdfURL: '',
      uno: '',
      dos: '',
      tres: '',
      cuatro: '',
      cinco: '',
      seis: '',
      siete: '',
      ocho: '',
      nueve: '',
      diez: '',
      once: '',
      doce: '',
      trece: '',
      temas:  [
          'Anatomía, Morfología, Bioquímica y Fisiología',
          'Biogeografía y floristica',
          'Ecología, Conservación y Manejo de Recursos Naturales',
          'Etnobotánica y Botánica Económica',
          'Taxonomía y Sistemática'
      ],
      headers: [
        { text: 'Titulo', align: 'center', sortable: true, value: 'title'},
        { text: 'Autor', align: 'center', value: 'author', sortable: false },
        { text: 'Acciones', value: 'title', sortable: false }
      ],
      rev1:'',
      rev2:'',
      rev3:'',
      revID:[],
      revNAME:[],
      abstracts: [],
      editedIndex: -1,
      editedItem: {
        id:'',
        author:'',
        title:'',
        principal: '',
        competition: '',
        start: '',
        end: '', 
        articleRef: '',
        tesisUrl: '',
        testUrl: '',
        ticketUrl: ''
      },
      defaultItem: {
        id:'',
        author:'',
        title:'',
        principal: '',
        competition: '',
        start: '',
        end: '', 
        articleRef: '',
        tesisUrl: '',
        testUrl: '',
        ticketUrl: ''
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

        //return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      /*uploadTask: function () {
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
    }*/
    },

    created () {
      this.initialize()
    },

    methods: {
      ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'mostrarExito', 'mostrarError','mostrarAdvertencia']),
      
      sendCorreo(){
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'botanicauaa@gmail.com',
            pass: 'Ra113581321'
          }
        })

        let mailOptions = {
          from: 'botanicauaa@gmail.com',
          to: 'raulsv.28@gmail.com',
          subject: 'Sending Email using Node.js',
          text: 'That was easy!'
        }
        
        transporter.sendmail(mailOptions, function(error, info){
          if (error)
            this.mostrarExito(error)
          else 
            this.mostrarExito('Email sent: ' + info.response)
        })
      },

      selectFile () {
        this.$refs.uploadInput.click()
      },
      
      detectFiles (e) {
        this.filePdf = e.target.files || e.dataTransfer.files
        this.fileName = this.filePdf[0].name
      },  

      selectFile2 () {
        this.$refs.uploadInput2.click()
      },
      
      detectFiles2 (e) {
        this.filePdf2 = e.target.files || e.dataTransfer.files
        this.fileName2 = this.filePdf2[0].name
      }, 

      selectFile3 () {
        this.$refs.uploadInput3.click()
      },
      
      detectFiles3 (e) {
        this.filePdf3 = e.target.files || e.dataTransfer.files
        this.fileName3 = this.filePdf3[0].name
      },

      async consultarRevisor(){
        let docs = await db.collection('usr').get()
        docs.forEach(doc => {
            if(doc.data().usrType == 2)
              this.revisores.push(doc.data())
          })
      },

      async consultarResumen(){
        let uid = auth.currentUser.uid
        await db.collection('usr').doc(uid).get().then(doc => {
          this.usrType = doc.data().usrType
          this.nameCurrentUsr = doc.data().name
        })
        let docs = await db.collection('tesis').get()
        if(this.usrType == 0){
          docs.forEach(doc => {
            if(doc.data().uid == uid)
              this.abstracts.push(doc.data())
          })
        }
        else if(this.usrType == 1){
          docs.forEach(doc => {
              this.abstracts.push(doc.data())
        })
        }
        else if(this.usrType == 2){
          docs.forEach(doc => {
            this.mostrarAdvertencia(doc.data().reviser1)
            if(doc.data().reviser1 == this.nameCurrentUsr || doc.data().reviser2 == this.nameCurrentUsr || doc.data().reviser3 == this.nameCurrentUsr)
              this.abstracts.push(doc.data())
        })
        }
        if (this.abstracts.length == 0) {
          this.mostrarAdvertencia('No hay tesis guardadas')
        }
      },

      initialize () {
        this.consultarResumen()
        this.asigReviser()
        this.abstracts = []
        this.revNAME = []
        this.revID = []
      },
    
      linkTesis(item){
        window.open(item.tesisUrl)
      },

      linkTest(item){
        window.open(item.testUrl)
      },

      linkTicket(item){
        window.open(item.ticketUrl)
      },

      async asigReviser(){
        let docs = await db.collection('usr').get()
        docs.forEach(doc => {
          if(doc.data().usrType == 2){
            this.revID.push(doc.data().uid)
            this.revNAME.push(doc.data().name)
          }
        })
      },

      async editItem (item) {
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async editItemTopic (item) {
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogTema = true
      },

      async editItemEval (item) {
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogView=true
      },

      deleteItem (item) {
        let uid = auth.currentUser.uid
        this.editedIndex = this.abstracts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        let ref = this.editedItem.id
        storage.ref(`tesis/${uid}/${ref}.pdf`).delete()
        db.collection("tesis").doc(ref).delete()
        this.mostrarExito('Entrada borrada')
        this.initialize()
      },

      close () {
        this.dialog = false
      },

      async save () {
        this.mostrarOcupado({ titulo: 'Guardando', mensaje: 'Espere mientras guardamos su entrada...' })
        let uid = auth.currentUser.uid 
        let usr = await db.collection('usr').doc(uid).get()
        let archivoId = uuidv4()
        try {
          //this.uploading = true
          this.uploadTask = await storage.ref(`tesis/${uid}/${archivoId}_tesis.pdf`).put(this.filePdf[0])
          let tesisUrl = await this.uploadTask.ref.getDownloadURL()
          this.uploadTask = await storage.ref(`tesis/${uid}/${archivoId}_test.pdf`).put(this.filePdf2[0])
          let testUrl = await this.uploadTask.ref.getDownloadURL()
          this.uploadTask = await storage.ref(`tesis/${uid}/${archivoId}_ticket`).put(this.filePdf3[0])
          let ticketUrl = await this.uploadTask.ref.getDownloadURL()
          let resumen = {
            uid,  
            id: archivoId,
            author: usr.data().name,
            title: this.editedItem.title,
            principal: this.editedItem.principal,
            competition: this.editedItem.competition,
            start: this.editedItem.start,
            end: this.editedItem.end, 
            articleRef: this.editedItem.articleRef,
            tesisUrl: tesisUrl,
            testUrl: testUrl,
            ticketUrl: ticketUrl,
            reviser1: '',
            reviser2: '',
            reviser3: '',
            date: new Date()
        }
        await db.collection('tesis').doc(archivoId).set(resumen)
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
        /*this.uploadTask = await storage.ref(`tesis/${uid}/${ref}_tesis.pdf`).put(this.filePdf[0])
        let tesisUrl = await this.uploadTask.ref.getDownloadURL()
        this.uploadTask = await storage.ref(`test/${uid}/${ref}_test.pdf`).put(this.filePdf2[0])
        let testUrl = await this.uploadTask.ref.getDownloadURL()*/
        this.uploadTask = await storage.ref(`tesis/${uid}/${ref}_ticket`).put(this.filePdf3[0])
        let ticketUrl = await this.uploadTask.ref.getDownloadURL()
        let resumen = {
            //title: this.editedItem.title,
            //principal: this.editedItem.principal,
            //competition: this.editedItem.competition,
            //start: this.editedItem.start,
            //end: this.editedItem.end, 
            //articleRef: this.editedItem.articleRef,
            //tesisUrl: tesisUrl,
            //testUrl: testUrl,
            ticketUrl: ticketUrl,
            tesisTopic: '',
            //date: new Date()
        }
        await db.collection('tesis').doc(ref).update(resumen)
        this.ocultarOcupado()
        this.mostrarExito('Entrada actualizada')
        this.close()
        this.initialize()
      },

      async tesisTopicUpdate(){
        this.mostrarOcupado({ titulo: 'Actualizando', mensaje: 'Espere mientras actualizamos su entrada...' })
        let ref = this.editedItem.id
        await db.collection('tesis').doc(ref).update({tesisTopic:this.topic})
        this.ocultarOcupado()
        this.dialogTema = false
        this.mostrarExito('Entrada actualizada')
        this.close()
        this.initialize()
      },

      async reviserUpdate(){
        this.mostrarOcupado({ titulo: 'Actualizando', mensaje: 'Espere mientras actualizamos su entrada...' })
        //this.sendCorreo()
        let ref = this.editedItem.id
        this.mostrarExito(this.editedItem.title)
        await db.collection('tesis').doc(ref).update({
          reviser1:this.rev1,
          reviser2:this.rev2,
          reviser3:this.rev3
        })
        this.ocultarOcupado()
        this.dialogRevisor = false
        this.mostrarExito('Entrada actualizada')
        this.close()
        this.initialize()
      },
      
      async evaluacion () {
        let reviserName = ''
        let usrTesisId = ''
        this.mostrarOcupado({ titulo: 'Guardando', mensaje: 'Espere mientras guardamos su entrada...' })
        let reviserId = auth.currentUser.uid 
        await db.collection('usr').doc(reviserId).get().then(doc => {
          reviserName = doc.data().name
          usrTesisId = doc.data().uid
        })
        let ref = this.editedItem.id
        let tesisTitle = this.editedItem.title
        try {
          let ev = {
            reviserName,
            reviserId,
            tesisTitle,
            usrTesisId,
            1: this.uno, 
            2: this.dos,
            3: this.tres,
            4: this.cuatro,
            5: this.cinco,
            6: this.seis,
            7: this.siete,
            8: this.ocho,
            9: this.nueve,
            10: this.diez,
            11: this.once,
            12: this.doce,
            date: new Date()
        }
        await db.collection('eval').doc(ref).set(ev)
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
    }
  }
</script>
