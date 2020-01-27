<template>
  <div>
    <dropdown-address-selector
      :clear-address="clearAddress"
      :currency="currency"
      :title="title"
      @toAddress="getToAddress($event)"
    />
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { mapState } from 'vuex';
import { EthereumTokens, hasIcon } from '@/partners';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

export default {
  components: {
    'dropdown-address-selector': DropDownAddressSelector
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    currentAddress: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    preFill: {
      type: Boolean,
      default: false
    },
    preFillAddress: {
      type: String,
      default: ''
    },
    clearAddress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      validityState: 0,
      EnsAddress: '',
      EthereumTokens: EthereumTokens,
      selectedAddress: '',
      isValidAddress: false,
      unableToValidate: false
    };
  },
  computed: {
    ...mapState('main', ['ens'])
  },
  watch: {
    clearAddress() {
      this.selectedAddress = '';
    }
  },
  mounted() {
    if (this.preFill) {
      this.selectedAddress =
        this.preFillAddress !== '' ? this.preFillAddress : '';
    }
  },
  methods: {
    getIcon(currency) {
      return hasIcon(currency);
    },
    async getToAddress(data) {
      this.selectedAddress = data.address;
      this.isValidAddress = data.valid;
      this.$emit('toAddress', data.address);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapAddressSelector';
</style>
