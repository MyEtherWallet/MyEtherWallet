<template lang="html">
  <div class="address-container">
    <div class="currency-container">
      <div class="icon-matcher">
        <img :src="iconFetcher" />
      </div>
      <p>
        <span class="currency-amt">
          {{ direction === 'from' ? '-' : '+' }}
          {{ tokenTransferVal !== '' ? tokenTransferVal : converter(value) }}
        </span>
        <span class="currency-type"
          >{{ tokenSymbol !== '' ? tokenSymbol : currency.toUpperCase() }}
        </span>
      </p>
    </div>
    <div class="identicon-container">
      <p>{{ direction | capitalize }} Address</p>
    </div>
    <div class="address">{{ checksumAddress }}</div>
    <div v-if="tokenSymbol !== '' && direction === 'to'">
      <p>Via contract</p>
      <div class="address">{{ tokenChecksumAddress }}</div>
    </div>
  </div>
</template>

<script>
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import web3 from 'web3';
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'eth'
    },
    tokenTransferTo: {
      type: String,
      default: ''
    },
    tokenTransferVal: {
      type: String,
      default: ''
    },
    tokenSymbol: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconFetcher() {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/${lowerCaseCurrency}.svg`);
      } catch (e) {
        icon = this.icon;
      }
      return icon;
    },
    lowerCaseCurrency() {
      return this.tokenSymbol.toLowerCase();
    },
    checksumAddress() {
      if (isAddress(this.tokenTransferTo.toLowerCase()))
        return toChecksumAddress(this.tokenTransferTo.toLowerCase());
      if (isAddress(this.address)) return toChecksumAddress(this.address);
      return '';
    },
    tokenChecksumAddress() {
      if (isAddress(this.address)) return toChecksumAddress(this.address);
      return '';
    }
  },
  methods: {
    converter(num) {
      return web3.utils.fromWei(num.toString(), 'ether');
    }
  }
};
</script>

<style lang="scss">
@import 'AddressBlock.scss';
</style>
