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
  mounted() {
    this.toAddress = '';
    this.resolvedAddr = '';
  },
  methods: {
    setAddress(newVal, isvalid) {
      this.resolvedAddr = newVal;
      this.isvalid = isvalid;
      if (!this.isvalid) {
        this.isDisabled = true;
        return;
      }
      this.manageDomainHandler.estimateGas(this.resolvedAddr).then(val => {
        this.manageDomainHandler.web3.eth
          .getBalance(this.resolvedAddr)
          .then(bal => {
            const hasBalance = BigNumber(val).lte(bal); // change to lte
            this.isDisabled = !(isvalid && hasBalance);
            console.log(
              'Transaction Fee: ' +
                this.manageDomainHandler.web3.utils.fromWei(val) +
                ' ETH'
            );
            console.log(
              'Balance: ' +
                this.manageDomainHandler.web3.utils.fromWei(bal) +
                ' ETH'
            );
            if (!hasBalance) {
              //throw new Error('Not enough balance');
              console.log('Not enough balance!');
            }
          });
      });
    }
  }
};
</script>
