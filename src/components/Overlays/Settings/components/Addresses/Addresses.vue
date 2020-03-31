<template>
  <v-data-table :headers="headers" :items="addresses" sort-by="calories">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn
              depressed
              color="emerald"
              dark
              class="mb-2 text-transform--initial"
              v-on="on"
              >+ Add</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.nickname"
                      label="Nickname"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
    <template v-slot:item.blockie="{ item }">
      <blockie
        :address="item.address"
        :size="8"
        :scale="16"
        width="30px"
        height="30px"
        class="blockie-image"
      />
    </template>
  </v-data-table>
</template>

<script>
import Blockie from '@/web/components/Blockie';

export default {
  components: { Blockie },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: '#',
        value: 'index'
      },
      {
        text: '',
        value: 'blockie'
      },
      {
        text: 'ADDRESS',
        value: 'address'
      },
      { text: 'NICKNAME', value: 'nickname' },
      { text: '', value: 'actions', sortable: false }
    ],
    addresses: [],
    editedIndex: -1,
    editedItem: {
      address: '',
      nickname: ''
    },
    defaultItem: {
      address: '',
      nickname: ''
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.initialize();

    // Add index numbers to items
    this.addresses.forEach((e, i) => {
      e.index = i + 1;
    });
  },

  methods: {
    initialize() {
      this.addresses = [
        {
          address: '0x4b0959AE0b7F0a56407eD0a47539649F4FD3A599',
          nickname: 'Moms'
        },
        {
          address: '0xd7B9A9b2F665849C4071Ad5af77d8c76aa30fb32',
          nickname: 'Dads'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          nickname: 'Mikes'
        }
      ];
    },
    editItem(item) {
      this.editedIndex = this.addresses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.addresses.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.addresses.splice(index, 1);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.addresses[this.editedIndex], this.editedItem);
      } else {
        this.addresses.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.descriptions {
  max-width: 450px;
}
</style>
