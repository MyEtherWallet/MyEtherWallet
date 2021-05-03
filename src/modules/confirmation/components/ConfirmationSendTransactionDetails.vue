<template>
  <v-sheet max-width="600px" class="pa-2">
    <!-- Sending Section -->
    <div class="d-flex justify-space-between align-center">
      <div class="border-radius--5px pa-2 information-container">
        <v-row>
          <!-- icon -->
          <v-col cols="2"> </v-col>
          <!-- tx information -->
          <v-col cols="10" class="d-flex flex-column text-left">
            <p class="text-uppercase">SENDING</p>
            <!-- Span has to be smaller than the value text -->
            <p class="text-uppercase">
              {{ value }} <span>{{ network.type.currencyName }}</span>
            </p>
          </v-col>
        </v-row>
      </div>
      <!-- Arrow Icon -->
      <div align-self="center" class="text-center">
        <v-icon> mdi-arrow-right </v-icon>
      </div>
      <!-- To Address -->
      <div class="border-radius--5px pa-2 information-container">
        <v-row>
          <!-- icon -->
          <v-col cols="2"> </v-col>
          <!-- tx information -->
          <v-col cols="10" class="d-flex flex-column text-left">
            <p class="text-uppercase">TO ADDRESS</p>
            <p class="text-uppercase">{{ toEnsName }}</p>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- Transaction fee -->
    <div class="top-border py-5 mt-5">
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0">TRANSACTION FEE</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p>{{ txFee }} {{ network.type.currencyName }}</p>
          <p class="ml-6">$ {{ txFeeUsd }}</p>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0">TOTAL</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p>{{ totalTxFee }} {{ network.type.currencyName }}</p>
          <p class="ml-6">$ {{ totalTxFeeUSD }}</p>
        </div>
      </div>
    </div>
    <!-- More Details -->
    <div></div>
    <mew-warning-sheet :description="warningDescription" />
  </v-sheet>
</template>

<script>
import TransactionAddresses from './TransactionAddresses';
import TransactionBalance from './TransactionBalance';
export default {
  components: {
    TransactionAddresses,
    TransactionBalance
  },
  props: {
    to: {
      type: String,
      default: ''
    },
    toEnsName: {
      type: String,
      default: ''
    },
    toCurrency: {
      type: String,
      default: ''
    },
    toIcon: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    fromEnsName: {
      type: String,
      default: ''
    },
    fromCurrency: {
      type: String,
      default: ''
    },
    fromIcon: {
      type: String,
      default: ''
    },
    data: {
      type: String,
      default: ''
    },
    gasPrice: {
      type: String,
      default: ''
    },
    gasLimit: {
      type: String,
      default: ''
    },
    nonce: {
      type: Number,
      default: 0
    },
    network: {
      type: Object,
      default: () => {}
    },
    txFee: {
      type: String,
      default: '0'
    },
    txFeeUsd: {
      type: String,
      default: '0'
    },
    totalTxFee: {
      type: String,
      default: '0'
    },
    totalTxFeeUSD: {
      type: String,
      default: '0'
    },
    value: {
      type: String,
      default: '0'
    }
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'Details'
        }
      ],
      activeTab: 0
    };
  },
  computed: {
    details() {
      return [
        {
          title: 'Network',
          value: this.network.type.name + ' by ' + this.network.service
        },
        {
          title: 'Gas Price',
          value: this.gasPrice + ' gwei'
        },
        {
          title: 'Gas Limit',
          value: this.gasLimit
        },
        {
          title: 'Nonce',
          value: this.nonce
        },
        {
          title: 'Data',
          value: this.data
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.information-container {
  background-color: #f9f9f9;
  height: 100px;
  width: 100%;
}
.top-border {
  border-top: 1px solid #f9f9f9;
}

.width-40 {
  width: 40%;
}
</style>
