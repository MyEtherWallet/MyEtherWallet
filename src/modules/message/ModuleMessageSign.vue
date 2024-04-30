<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="title"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div>
        <v-textarea
          v-model="message"
          outlined
          label="Signature"
          :value="message"
        ></v-textarea>
        <div class="text-right">
          <mew-button
            btn-style="light"
            title="Clear all"
            class="mr-4"
            @click.native="clearAll"
          />
          <mew-button
            title="Sign"
            :disabled="disableSignBtn"
            @click.native="signMessage"
          />
        </div>
      </div>
    </template>
  </mew-module>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import { wallet as useWalletStore } from '@/core/store/index.js';

import SignAndVerifyMessage from '@/modules/message/handlers';

// injections/use
const { instance } = useWalletStore();

// data
const title = ref('Sign Message');
const message = ref('');
const signature = ref('');
const signAndVerify = ref('');

// computed
const disableSignBtn = computed(() => {
  return message.value === '';
});

// mounted
onMounted(() => {
  signAndVerify.value = new SignAndVerifyMessage();
});

// methods
const signMessage = () => {
  try {
    signAndVerify.value
      .signMessage(message.value)
      .then(() => {
        message.value = '';
      })
      .catch(e => {
        message.value = '';
        instance.errorHandler(e.message);
      });
  } catch (e) {
    instance.errorHandler(e.hasOwnProperty('message') ? e.message : e);
  }
};
const clearAll = () => {
  signature.value = '';
  message.value = '';
};
</script>
