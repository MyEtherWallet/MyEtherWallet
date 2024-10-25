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
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

import addressBook from '@/modules/address-book/ModuleAddressBook';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
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
      this.resolvedAddr = newVal;
      this.isvalid = isvalid;
      if (!this.isvalid) {
        this.isDisabled = true;
        return;
      }
      this.manageDomainHandler
        .estimateGas(this.resolvedAddr)
        .then(val => {
          const hasBalance = BigNumber(val).lte(this.balance);
          this.isDisabled = !(isvalid && hasBalance);
          if (!hasBalance) {
            Toast('Not enough balance', {}, ERROR);
          }
        })
        .catch(val => {
          Toast(val, {}, ERROR);
        });
    }
  }
};
</script>
