<template>
  <v-sheet max-width="600px" class="pa-2">
    <!-- Sending Section -->
    <div class="d-flex justify-space-between align-center">
      <div class="border-radius--5px pa-2 information-container">
        <v-row>
          <!-- icon -->
          <v-col cols="2">
            <img :src="currency.img" width="32px" class="currency-icon" />
          </v-col>
          <!-- tx information -->
          <v-col cols="10" class="d-flex flex-column text-left">
            <p class="text-uppercase ma-0">SENDING</p>
            <!-- Span has to be smaller than the value text -->
            <p class="text-uppercase ma-0">
              {{ currency.amount }} <span>{{ currency.name }}</span>
            </p>
            <p class="text-uppercase ma-0">$ {{ usdAmount }}</p>
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
            <p class="text-uppercase ma-0">TO ADDRESS</p>
            <p class="ma-0 text-wrap">{{ actualToAddress }}</p>
            <p v-show="toEnsName !== ''" class="ma-0">{{ toEnsName }}</p>
            <p v-show="showToAddress" class="ma-0 truncate">{{ to }}</p>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- Transaction fee -->
    <v-divider :light="true" class="mt-5" />
    <div class="py-5">
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0">TRANSACTION FEE</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p class="ma-0">{{ txFee }} {{ network.type.currencyName }}</p>
          <p class="ml-6 ma-0">$ {{ txFeeUsd }}</p>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0">TOTAL</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p class="ma-0">{{ totalTxFee }} {{ network.type.currencyName }}</p>
          <p class="ml-6 ma-0">~$ {{ totalTxFeeUSD }}</p>
        </div>
      </div>
    </div>
    <!-- More Details -->
    <mew-expand-panel
      :has-dividers="true"
      :panel-items="panelItems"
      :idx-to-expand="2"
      class="mb-5"
    >
      <template #panelBody1>
        <div>
          <div
            v-for="dets in details"
            :key="dets.title + dets.value"
            class="d-flex justify-space-between"
          >
            <p class="text-left text-capitalized">{{ dets.title }}</p>
            <p class="text-right data-values">{{ dets.value }}</p>
          </div>
        </div>
      </template>
    </mew-expand-panel>
    <mew-warning-sheet :description="warningDescription" />
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
export default {
  props: {
    to: {
      type: String,
      default: ''
    },
    toEnsName: {
      type: String,
      default: ''
    },
    toNickName: {
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
    sendCurrency: {
      type: Object,
      default: () => {}
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
    },
    valueUsd: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      warningDescription:
        'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…',
      open: false,
      panelItems: [
        {
          name: 'More Details'
        }
      ],
      activeTab: 0
    };
  },
  computed: {
    currency() {
      const obj = Object.assign({}, this.sendCurrency);
      if (!obj.hasOwnProperty('amount') && !obj.hasOwnProperty('price')) {
        obj['amount'] = this.value;
        obj['price'] = this.valueUsd;
      }
      return obj;
    },
    usdAmount() {
      return BigNumber(this.currency.amount)
        .times(this.currency.price)
        .toFixed(2);
    },
    details() {
      const details = [
        {
          title: 'Network',
          value: this.network.type.name_long
        },
        {
          title: 'From ENS',
          value: this.fromEnsName
        },
        {
          title: 'From address',
          value: this.from
        },
        {
          title: 'To address',
          value: this.to
        },
        {
          title: 'Sending',
          value: `${this.value} ${this.currency.symbol}`
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
          title: 'Transaction fee',
          value: `${this.txFee} ${this.network.type.currencyName} ~ $ ${this.txFeeUsd}`
        },
        {
          title: 'Nonce',
          value: `${this.nonce}`
        },
        {
          title: 'Data',
          value: this.data
        }
      ];
      return details.filter(item => {
        return item.value !== '';
      });
    },
    showToAddress() {
      return this.toNickName !== '' && this.toEnsName !== '';
    },
    actualToAddress() {
      return this.toNickName !== ''
        ? this.toNickName
        : this.toEnsName !== ''
        ? this.toEnsName
        : this.to;
    }
  }
};
</script>

<style lang="scss" scoped>
.information-container {
  background-color: #f9f9f9;
  height: 100px;
  width: 100%;
  max-width: 215px;
}

.width-40 {
  width: 40%;
  max-width: 40%;
}

.text-wrap {
  overflow-wrap: break-word;
}

.data-values {
  max-width: 321px;
}

.currency-icon {
  border-radius: 50%;
}
</style>
