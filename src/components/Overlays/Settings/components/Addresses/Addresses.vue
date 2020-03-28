<template>
  <div>
    <div class="descriptions mb-7">
      You can add up to 10 contact addresses.
    </div>
    <div class="mb-5">
      <v-data-table
        :headers="adresses.headers"
        :items="adresses.desserts"
        :items-per-page="5"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.number>
          {{ getAddressCount() }}
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
    </div>
    <StdButton buttonclass="button--green-border">
      + Add
    </StdButton>
  </div>
</template>

<script>
import StdButton from '@/web/components/StdButton';
import Blockie from '@/web/components/Blockie';

export default {
  components: { StdButton, Blockie },
  props: {},
  data() {
    return {
      adresses: {
        count: 0,
        headers: [
          {
            text: '#',
            value: 'number'
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
        desserts: [
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
        ]
      }
    };
  },
  methods: {
    getAddressCount() {
      this.adresses.count++;
      return this.adresses.count;
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
