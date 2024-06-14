<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    title="Verify Message"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <v-textarea
        v-model="message"
        class="VerifyInput"
        outlined
        label="Signature"
      />

      <div
        v-if="signResult"
        class="walletBg pa-3 VerifyMessage d-flex flex-wrap"
      >
        <span class="signer mr-1">
          {{ signer }}
        </span>
        <span v-if="didSign" class="font-weight-medium">
          did sign the message
        </span>
        <span v-if="didntSign" class="font-weight-medium">
          didn't sign the message
        </span>
      </div>

      <div v-if="verificationError" class="walletBg pa-3">
        {{ t('signMessage.failed') }}
      </div>

      <div
        :class="['text-right', signResult || verificationError ? 'pt-3' : '']"
      >
        <mew-button
          btn-style="light"
          title="Clear all"
          class="mr-4"
          @click.native="clearAll"
        />
        <mew-button
          :disabled="!message"
          title="Verify"
          @click.native="verifyMessage"
        />
      </div>
    </template>
  </mew-module>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toChecksumAddress } from 'ethereumjs-util';
import { useI18n } from 'vue-i18n-composable';

import SignAndVerifyMessage from '@/modules/message/handlers';

// injections
const { t } = useI18n();

// data
const didSign = ref(false);
const didntSign = ref(false);
const signResult = ref(false);
const verificationError = ref(false);
const message = ref('');
const signer = ref('');
const signAndVerify = ref(null);

// mounted
onMounted(() => {
  signAndVerify.value = new SignAndVerifyMessage();
});

// methods
const verifyMessage = () => {
  try {
    verificationError.value = false;
    signResult.value = false;
    didSign.value = false;
    didntSign.value = false;
    const signCheck = signAndVerify.value.verifyMessage(message.value);
    const parsedMessage = JSON.parse(message.value);
    if (!parsedMessage.address) {
      verificationError.value = true;
      return;
    }
    if (
      signCheck.verified &&
      toChecksumAddress(parsedMessage.address) ===
        toChecksumAddress('0x' + signCheck.signer)
    ) {
      didSign.value = true;
    } else {
      didntSign.value = true;
    }
    signer.value = parsedMessage.address;
    signResult.value = true;
  } catch {
    verificationError.value = true;
  }
};

const clearAll = () => {
  verificationError.value = false;
  didntSign.value = false;
  didSign.value = false;
  signResult.value = false;
  message.value = '';
  signer.value = '';
};
</script>

<style lang="scss" scoped>
.signer {
  overflow-wrap: anywhere;
}
</style>
