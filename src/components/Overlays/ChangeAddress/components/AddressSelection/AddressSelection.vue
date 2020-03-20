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
        :items="desserts"
        single-select
        item-key="address"
        show-select
        items-per-page="5"
        class="mt-3"
      >
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    text: { default: '', type: String }
  },
  data() {
    return {
      selected: [],
      headers: [
        {
          text: 'ADDRESS',
          align: 'start',
          sortable: true,
          value: 'address'
        },
        { text: 'ETH BALANCE', value: 'balance' },
        { text: '#TOKENS', value: 'tokens' }
      ],
      desserts: [
        {
          address: '0x22bF0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x3dbF0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x65230622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x7abF0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x76320622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x13h70622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x1234F0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x9gr40622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0xyyh0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x78340622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x345740622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0x34690622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0xg523g0622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
        },
        {
          address: '0xg5dfh4622d4....e3C4',
          balance: '159.32 ETH',
          tokens: '12'
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
