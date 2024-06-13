<template>
  <div class="full-width pt-6">
    <h3 class="mb-6">Enter your private key</h3>
    <!--
    =====================================================================================
      Private Key Input
    =====================================================================================
    -->
    <mew-input
      v-model="privateKey"
      class="PrivateKeyInput"
      label="Private Key"
      placeholder="Enter your Private Key"
      :rules="privKeyRules"
      type="password"
    />
    <!--
    =====================================================================================
      Terms Checkbox & Access Button
    =====================================================================================
    -->
    <div class="text-center">
      <mew-checkbox v-model="invis" class="checkbox" />
      <mew-checkbox
        v-model="acceptTerms"
        :label="label"
        :link="link"
        class="justify-center PrivateKeyTerms"
      />
      <v-row dense class="align-center justify-center pt-4">
        <v-col cols="12" sm="4">
          <mew-button
            class="PrivateKeyAccess"
            has-full-width
            title="Access Wallet"
            btn-size="xlarge"
            :disabled="!disableBtn"
            @click.native="unlockBtn"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, defineEmits } from 'vue';
import { isValidPrivate } from 'ethereumjs-util';
import { isString } from 'lodash';

import { isPrivateKey } from '../handlers/helpers';
import {
  getBufferFromHex,
  sanitizeHex
} from '../../../access-wallet/common/helpers';
import { ACCESS_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';

// defineEmits
const emit = defineEmits(['unlock']);

// injections/use
const { trackAccessWalletAmplitude } = useAmplitude();
const { isOfflineApp } = useWalletStore();

// props
const props = defineProps({
  handlerAccessWallet: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

// data
const privateKey = ref('');
const acceptTerms = ref(false);
const invis = ref(false);
const label = ref('To access my wallet, I accept ');
const link = ref({
  title: 'Terms',
  url: 'https://www.myetherwallet.com/terms-of-service'
});

// computed
/**
 * Property that controls Access Wallet button
 * Button is enabled when terms were accepted and
 * private key entered is valid
 * @return boolean
 */
const disableBtn = computed(() => {
  return acceptTerms.value && isPrivKey.value;
});
/**
 * Property validates whether or not entered private key is valid
 * @return booelan
 */
const isPrivKey = computed(() => {
  const _privKey = Buffer.isBuffer(actualPrivateKey.value)
    ? actualPrivateKey.value
    : getBufferFromHex(sanitizeHex(actualPrivateKey.value));
  return isPrivateKey(privateKey.value) && isValidPrivate(_privKey);
});
/**
 * @returns actual private without '0x' prefix
 */
const actualPrivateKey = computed(() => {
  if (!isString(privateKey.value)) return '';
  return privateKey.value && privateKey.value.substr(0, 2) === '0x'
    ? privateKey.value.replace('0x', '')
    : privateKey.value;
});
/**
 * @returns rules fot the private key input
 */
const privKeyRules = computed(() => {
  return [
    value => !!value || 'Required',
    value => isPrivateKey(value) || 'This is not a real private Key'
  ];
});

// watch
watch(
  () => privateKey,
  val => {
    if (val !== '' && !isPrivKey.value) {
      trackAccessWalletAmplitude(ACCESS_WALLET.SOFTWARE_FAILED, {
        error: 'This is not a real private Key'
      });
    }
  }
);
watch(
  () => acceptTerms,
  val => {
    if (val) {
      trackAccessWalletAmplitude(ACCESS_WALLET.PRIV_KEY_TERMS);
    }
  }
);
watch(
  () => invis,
  val => {
    if (val) {
      trackAccessWalletAmplitude(ACCESS_WALLET.PRIV_INVISIBLE_BOX);
    }
  }
);

// mounted
onMounted(() => {
  if (isOfflineApp.value) {
    link.value = {};
    label.value = 'To access my wallet, I accept Terms';
  }
});

// methods
const unlockBtn = () => {
  props.handlerAccessWallet.unlockPrivateKeyWallet(actualPrivateKey.value);
  emit('unlock');
  privateKey.value = '';
};
</script>

<style lang="scss" scoped>
.checkbox {
  opacity: 0 !important;
}
</style>
