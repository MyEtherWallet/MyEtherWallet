<template>
  <div>
    <div class="pa-3">
      <div
        class="d-flex align-center theme--light-text--white border-radius--5px network-block pl-5 pr-2 py-1 mb-3"
      >
        <div class="font-weight-medium subtitle-1">Network</div>
        <div class="ml-auto d-flex align-center">
          <div>ETH - myetherapi.com</div>
          <v-btn icon class="ml-1" dark>
            <v-icon
              class="theme--light-text--white theme--dark-text--blue"
              size="20px"
              >mdi-pencil-outline</v-icon
            >
          </v-btn>
        </div>
      </div>
      <div
        class="d-flex align-center theme--light-text--white theme--dark-text--white border-radius--5px address-block pl-5 pr-2 py-1"
      >
        <div class="font-weight-medium subtitle-1">
          Address to interact with
        </div>
        <div class="ml-auto">
          <v-btn icon dark>
            <v-icon class="theme--light-text--white" size="20px"
              >mdi-pencil-outline</v-icon
            >
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="addresses"
        single-select
        item-key="id"
        show-select
        :items-per-page="10"
        class="mt-3"
      >
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
        <template v-slot:item.address="{ item }">
          <Tooltip :text="item.address">
            {{ item.address.substring(0, 8) }}...{{
              item.address.substring(item.address.length - 4)
            }}
          </Tooltip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import Blockie from '@/web/components/Blockie';
import Tooltip from '@/web/components/Tooltip';

export default {
  components: { Blockie, Tooltip },
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {
      selected: [],
      headers: [
        { text: '', value: 'blockie' },
        {
          text: 'ADDRESS',
          align: 'start',
          sortable: true,
          value: 'address'
        },
        { text: 'ETH BALANCE', value: 'balance' },
        { text: '#TOKENS', value: 'tokens' }
      ],
      addresses: [
        {
          address: '0x4b0959AE0b7F0a56407eD0a47539649F4FD3A599',
          balance: '1.32 ETH',
          tokens: '12'
        },
        {
          address: '0xd7B9A9b2F665849C4071Ad5af77d8c76aa30fb32',
          balance: '1.11 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '45.4 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '5 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '0 ETH',
          tokens: '3'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '0 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '34.32 ETH',
          tokens: '1'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '1.32 ETH',
          tokens: '0'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '1.32 ETH',
          tokens: '0'
        },
        {
          address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
          balance: '0.32 ETH',
          tokens: '0'
        },
        {
          address: '0xg523g0622d4....e3C4',
          balance: '3 ETH',
          tokens: '0'
        },
        {
          address: '0xg5dfh4622d4....e3C4',
          balance: '77 ETH',
          tokens: '0'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.network-block {
  background-color: $dark-space;
}

.address-block {
  background-color: #184f90;
}
</style>
