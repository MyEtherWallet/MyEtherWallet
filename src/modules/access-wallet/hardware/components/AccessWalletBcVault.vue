<template>
  <v-sheet
    color="white"
    :rounded="true"
    max-width="475px"
    width="100%"
    class="pa-5"
  >
    <div class="d-flex flex-column align-center justify-center">
      <div
        v-if="accounts.length === 0 && loading"
        class="text-center bcvault-address-container"
      >
        <v-progress-circular indeterminate />
        <div class="text-center mew-subtitle">Loading...</div>
        <div class="text-center mew-heading-1">
          Please follow the prompts from the BCVault app and Hardware Wallet
        </div>
      </div>
      <div v-else-if="accounts.length === 0 && !loading" class="text-center">
        <v-icon color="titlePrimary"> mdi-alert </v-icon>
        <div class="text-center mew-heading-1">
          Connection timed out or user cancelled action or no account found!
        </div>
      </div>
      <div v-else class="text-center">
        <div
          v-for="acc in accounts"
          :key="acc.address"
          :class="[
            'pa-4 bcvault-address rounded d-flex flex-row align-center justify-space-between ma-2',
            selectedAddress === acc.userDataRaw + acc.address
              ? 'bcvault-active'
              : ''
          ]"
          @click="setAddress(acc.userDataRaw + acc.address)"
        >
          <mew-blockie
            :address="acc.userDataRaw + acc.address"
            width="30px"
            height="30px"
          />
          <span>{{ acc.userDataRaw + acc.address }}</span>
        </div>
        <mew-button
          title="Access Wallet"
          color-theme="primary"
          :has-full-width="false"
          btn-size="medium"
          icon-align="left"
          btn-style="background"
          :disabled="selectedAddress === ''"
          @click.native="nextStep"
        />
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'AccessWalletBcVault',
  props: {
    accounts: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    setAddress: {
      type: Function,
      default: function () {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bcvault-active {
  background-color: #dcfff9 !important;
  border-color: #05c0a5 !important;
}

.bcvault-address {
  cursor: pointer;
  border: 1px solid #0b1a40;
}
.bcvault-address-container {
  width: 100%;
}
</style>
