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
                        <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-data-table class="elevation-1" :headers="headers" :items="desserts" hide-actions>
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
                    <v-btn @click.native="selectFile" v-if="!uploadEnd && !uploading"> Subir archivo </v-btn>
                      {{ fileName }}
                    <input style="display: none" id="files" type="file" name="file" ref="uploadInput" accept=".pdf" :multiple="false" @change="detectFiles($event)" />
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
import { mapState } from 'vuex'
//import store from '@/store'

export default {
    data: () => ({
      dialog: false,
      headers: [
        { text: 'Nombre', align: 'center', sortable: false, value: 'name'},
        { text: 'Institución', align: 'center', sortable: false, value: 'institution'},
        { text: 'Municipio', align: 'center', sortable: false, value: 'municipality'},
        { text: 'Estado', align: 'center', sortable: false, value: 'state'},
        { text: 'País', align: 'center', sortable: false, value: 'country'},
        { text: 'Telefono', align: 'center', sortable: false, value: 'phone'},
        { text: 'Editar', value: 'name', sortable: false }
      ],
      desserts: [],
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
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            name: 'Raúl Sánchez Vázquez',
            institution: 'UAA',
            municipality: 'Jesús María',
            state: 'Aguascalientes',
            country: 'México',
            phone: '449109792',
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
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
    },
  /*computed: {
    ...mapState('sesion', ['usuario'])
  }*/
}
</script>
