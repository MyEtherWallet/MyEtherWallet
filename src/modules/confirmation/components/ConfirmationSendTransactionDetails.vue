<template>
  <v-sheet max-width="600px" class="pa-2">
    <!-- Sending Section -->
    <div class="d-flex justify-space-between align-center">
      <div class="border-radius--5px pa-2 information-container">
        <v-row>
          <!-- icon -->
          <v-col cols="2" align-self="center">
            <img :src="currency.img" width="32px" class="currency-icon" />
          </v-col>
          <!-- tx information -->
          <v-col cols="10" class="d-flex flex-column text-left">
            <p class="text-uppercase details-header mb-1">SENDING</p>
            <!-- Span has to be smaller than the value text -->
            <p class="text-uppercase ma-0 mew-heading-2">
              {{ currency.amount }}
              <span class="mew-caption">{{ currency.name }}</span>
            </p>
            <p class="text-uppercase ma-0 mew-heading-3 usd-to-amt">
              ${{ usdAmount }}
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
          <v-col
            cols="2"
            class="d-flex flex-column justify-center align-center"
          >
            <v-img
              v-if="avatar !== ''"
              :src="avatar"
              height="25px"
              width="25px"
              class="circle"
            />
            <mew-blockie
              :address="to"
              width="25px"
              height="25px"
              class="mx-2"
              v-else
            />
          </v-col>
          <!-- tx information -->
          <v-col cols="10" class="d-flex flex-column text-left">
            <p class="text-uppercase details-header mb-1">TO ADDRESS</p>
            <p
              v-if="toDetails.nickname !== ''"
              class="font-weight-bold text-truncate ma-0"
            >
              {{ toDetails.nickname }}
            </p>
            <p
              :class="[
                toDetails.nickname === '' ? 'text-wrap' : 'truncate',
                'address-color ma-0 mew-address'
              ]"
            >
              {{ to }}
            </p>
            <p v-if="toDetails.ensName !== ''" class="primary--text ma-0">
              {{ toDetails.ensName }}
            </p>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- Transaction fee -->
    <div class="py-5">
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0 fee-color">TRANSACTION FEE</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p class="ma-0 base-color">
            {{ txFee }}
            <span class="fee-color">{{ network.type.currencyName }} </span>
          </p>
          <p class="ml-6 ma-0 base-color">${{ txFeeUsd }}</p>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <div class="text-left">
          <p class="text-uppercase ma-0 fee-color">TOTAL</p>
        </div>
        <div class="width-40 text-right d-flex justify-space-between">
          <p class="ma-0 base-color">
            {{ totalFee }}
            <span class="fee-color">{{ network.type.currencyName }} </span>
          </p>
          <p class="ml-6 ma-0 base-color">${{ totalFeeUSD }}</p>
        </div>
      </div>
    </div>
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
    data: {
      type: String,
      default: ''
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
    value: {
      type: String,
      default: '0'
    },
    valueUsd: {
      type: Number,
      default: 0
    },
    toTxData: {
      type: Object,
      default: () => {}
    },
    toDetails: {
      type: Object,
      default: () => {}
    },
    sendCurrency: {
      type: Object,
      default: () => {}
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {};
  },
  computed: {
    currency() {
      const obj = Object.assign({}, this.sendCurrency);
      if (!obj.hasOwnProperty('amount')) obj['amount'] = this.value;
      if (!obj.hasOwnProperty('price')) obj['price'] = this.valueUsd;
      return obj;
    },
    totalFee() {
      if (this.currency.symbol === this.network.type.currencyName) {
        return BigNumber(this.value).plus(this.txFee).toFixed();
      }
      return this.txFee;
    },
    totalFeeUSD() {
      const ethFeeToUsd = BigNumber(this.totalFee).times(this.valueUsd);
      if (this.currency.symbol === this.network.type.currencyName) {
        const amountToUsd = BigNumber(this.value).times(this.valueUsd);
        return BigNumber(amountToUsd).plus(ethFeeToUsd).toFixed(2);
      }
      const tokenPrice = BigNumber(this.currency.price).times(this.value);
      return tokenPrice.plus(ethFeeToUsd).toFixed(2);
    },
    usdAmount() {
      return BigNumber(this.value).times(this.currency.price).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.information-container {
  background-color: #f9f9f9;
  height: 100px;
  width: 100%;
  max-width: 260px;
}

.width-40 {
  width: 40%;
  max-width: 40%;
}

.text-wrap {
  overflow-wrap: break-word;
}

.currency-icon {
  border-radius: 50%;
}

.details-header {
  font-size: 12px;
  color: #b3c3d7;
}

.usd-to-amt {
  color: #788ea7;
  font-weight: normal !important;
}

.address-color {
  color: #667f9b;
}

.fee-color {
  color: #96a8b6;
}

.base-color {
  color: var(--v-titlePrimary-base);
}
.circle {
  border-radius: 50%;
}
</style>
