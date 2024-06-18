<template>
  <div class="text-center">
    <div class="mt-2 mb-10 mew-heading-3 text-center">
      Please enter the password of your
      <span class="text-capitalize">{{ walletType }}</span> device.
    </div>

    <mew-input
      v-model="password"
      label="Password"
      placeholder="Enter your password"
      :type="onCoolWallet ? 'text' : 'password'"
    />

    <mew-button
      title="Access My Wallet"
      btn-size="xlarge"
      :disabled="!(password !== '' && acceptTerms)"
      @click.native="
        () => {
          nextStep();
        }
      "
    />

    <mew-checkbox
      v-model="acceptTerms"
      label="To access my wallet, I accept "
      :link="link"
      class="justify-center"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// emits
const emits = defineEmits(['setPassword', 'setTerms']);

// props
defineProps({
  walletType: {
    default: '',
    type: String
  },
  onCoolWallet: {
    default: false,
    type: Boolean
  },
  nextStep: {
    type: Function,
    default: () => {}
  }
});

// data
const link = {
  title: 'Terms',
  url: 'https://www.myetherwallet.com/terms-of-service'
};
const password = ref('');
const acceptTerms = ref(false);

// watch
watch(password, newVal => {
  emits('setPassword', newVal);
});

watch(acceptTerms, newVal => {
  emits('setTerms', newVal);
});
</script>
