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
      label="To access wallet, I accept "
      :link="link"
      class="justify-center"
    />
  </v-sheet>
</template>

<script>
export default {
  props: {
    walletType: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      acceptTerms: false,
      password: '',
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  watch: {
    password(newVal) {
      this.$emit('password', newVal);
    },
    acceptTerms(newVal) {
      this.$emit('setTerms', newVal);
    }
  }
};
</script>
