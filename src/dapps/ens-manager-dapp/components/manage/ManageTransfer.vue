<template>
  <div class="full-width">
    <addressBook @setAddress="setAddress" />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('ens.transfer')"
        btn-size="xlarge"
        :disabled="isDisabled"
        @click.native="transfer(resolvedAddr)"
      />
    </div>
  </div>
</template>

<script>
import addressBook from '@/modules/address-book/ModuleAddressBook';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { fromWei } from 'web3-utils';
export default {
  components: {
    addressBook
  },
  props: {
    transfer: {
      default: function () {
        return {};
      },
      type: Function
    },
    manageDomainHandler: {
      type: [Object, null],
      default: null
    }
  },
  data() {
    return {
      resolvedAddr: '',
      isvalid: false,
      isDisabled: true
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'address', 'balance'])
  },
  mounted() {
    this.toAddress = '';
    this.resolvedAddr = '';
  },
  methods: {
    setAddress(newVal, isvalid) {
      console.log(newVal);
      this.resolvedAddr = newVal;
      this.isvalid = isvalid;
      if (!this.isvalid) {
        this.isDisabled = true;
        return;
      }
      this.manageDomainHandler.estimateGas(this.resolvedAddr).then(val => {
        console.log(this.resolvedAddr);
        const hasBalance = BigNumber(val).lte(this.balance); // change to lte
        this.isDisabled = !(isvalid && hasBalance);
        console.log('Transaction Fee: ' + fromWei(val) + ' ETH');
        console.log('Balance: ' + fromWei(this.balance) + ' ETH');
        if (!hasBalance) {
          //throw new Error('Not enough balance');
          console.log('Not enough balance!');
        }
      });
    }
  }
};
</script>
