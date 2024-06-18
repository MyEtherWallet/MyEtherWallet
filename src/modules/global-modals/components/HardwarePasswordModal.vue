<template>
  <v-sheet
    :outlined="true"
    color="white"
    :rounded="true"
    class="pa-5 d-flex flex-column"
    width="100%"
    max-width="500px"
  >
    <div class="mt-2 mb-10 mew-heading-3 text-center">
      Please enter the password of your
      <span class="text-capitalize">{{ walletType }}</span> device.
    </div>

    <mew-input
      v-model.lazy="password"
      label="Password"
      placeholder="Enter your password"
      :type="onCoolWallet ? 'text' : 'password'"
    />

    <mew-checkbox
      v-model="acceptTerms"
      label="To access my wallet, I accept "
      :link="link"
      class="justify-center"
    />
  </v-sheet>
</template>

<script setup>
import { ref, watch } from 'vue';

// emits
const emit = defineEmits(['password', 'setTerms']);

// props
defineProps({
  walletType: {
    default: '',
    type: String
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
watch(
  () => password.value,
  newVal => emit('password', newVal)
);
watch(
  () => acceptTerms.value,
  newVal => emit('setTerms', newVal)
);
</script>
