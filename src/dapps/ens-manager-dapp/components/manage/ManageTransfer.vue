<template>
  <div class="full-width">
    <addressBook @setAddress="setAddress" />
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="t('ens.transfer')"
        btn-size="xlarge"
        :disabled="isDisabled"
        @click.native="transfer(resolvedAddr)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import BigNumber from 'bignumber.js';

import addressBook from '@/modules/address-book/ModuleAddressBook';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { useWalletStore } from '@/core/store/wallet';
import { useI18n } from 'vue-i18n-composable';

// injections
const { balance } = useWalletStore();
const { t } = useI18n();

// props
const props = defineProps({
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
});

// data
const resolvedAddr = ref('');
const isvalid = ref(false);
const isDisabled = ref(true);

// mounted
onMounted(() => {
  resolvedAddr.value = '';
});

// methods

const setAddress = (newVal, checkValid) => {
  resolvedAddr.value = newVal;
  isvalid.value = checkValid;
  if (!isvalid.value) {
    isDisabled.value = true;
    return;
  }
  props.manageDomainHandler
    .estimateGas(resolvedAddr)
    .then(val => {
      const hasBalance = BigNumber(val).lte(balance.value);
      isDisabled.value = !(isvalid.value && hasBalance);
      if (!hasBalance) {
        Toast('Not enough balance', {}, ERROR);
      }
    })
    .catch(val => {
      Toast(val, {}, ERROR);
    });
};
</script>
