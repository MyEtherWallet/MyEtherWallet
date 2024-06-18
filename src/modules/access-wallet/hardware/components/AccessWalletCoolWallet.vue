<template>
  <div>
    <mew-input
      v-model="pairingPassword"
      placeholder="Pairing Password"
      type="password"
      :error-messages="passwordErrorMsg"
    />
    <v-row no-gutters class="border-container mb-8">
      <v-col
        class="d-flex align-center justify-center pt-5"
        order="1"
        cols="12"
        lg="6"
        order-lg="2"
        order-md="1"
      >
        <img src="@/assets/images/hardware-wallets/coolwallet-sample.png" />
      </v-col>
      <v-col order-lg="1" order-md="2" order="2" lg="6" cols="12" class="pa-5">
        <h2 class="mew-heading-2 text-center ma-0">
          Where is my pairing password?
        </h2>
        <ol type="1" class="list-style-on pt-4 pl-3">
          <li>Connect your Cool Wallet device.</li>
          <li class="pt-3">Open CoolBitX mobile app</li>
          <li class="pt-3">
            Go to
            <b
              >Settings
              <v-icon size="small"> mdi-arrow-right </v-icon>
              Show pairing password.</b
            >
          </li>
        </ol>
        <p class="pt-3 ml-3">
          Need more help?
          <a
            href="https://kb.myetherwallet.com/en/hardware-wallets/using-coolwallet-with-mew/"
            rel="noopener noreferrer"
            target="_blank"
            >Read More
            <v-icon size="small" color="greenPrimary"> mdi-launch </v-icon>
          </a>
        </p>
        <p>
          Note: If device is not available in the pairing selection pop-up,
          please enable
          <b>Allow New Pairing</b> in the mobile app settings
        </p>
      </v-col>
    </v-row>
    <mew-button
      :has-full-width="true"
      btn-size="xlarge"
      title="Unlock Wallet"
      @click.native="coolWalletUnlock"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// emits
const emits = defineEmits(['password']);

// props
const props = defineProps({
  coolWalletUnlock: {
    type: Function,
    default: () => {}
  },
  passwordError: {
    type: Boolean,
    default: false
  }
});

// data
const pairingPassword = ref('');

// computed
const passwordErrorMsg = computed(() =>
  props.passwordError ? 'Invalid PIN. Please enter correct PIN.' : ''
);

// watch
watch(
  () => pairingPassword,
  newVal => {
    emits('password', newVal);
  }
);
</script>
<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-tagLabel-base);
  border-radius: 8px;
}

.list-style-on {
  list-style: auto !important;
}
</style>
