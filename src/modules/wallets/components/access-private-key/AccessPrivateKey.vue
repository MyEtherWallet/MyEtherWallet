<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-sheet
        :outlined="true"
        color="white"
        :rounded="true"
        :max-width="740"
        :min-width="740"
        :max-height="340"
        :min-height="340"
      >
        <div class="sheet-content">
          <p class="mew-heading-1">Enter my Private Key</p>
          <mew-input
            v-model="privateKey"
            label="Private Key"
            placeholder="Enter my Private Key"
          />
          <v-container class="password-container">
            <v-col align="center" justify="start">
              <mew-button
                title="Access My Wallet"
                button-size="large"
                @click.native="unlockBtn"
              />
              <mew-checkbox
                label="To access my wallet, I accept Terms."
                :link="link"
              />
            </v-col>
          </v-container>
        </div>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AccessPrivateKEy',
  props: {
    unlockPrivateKeyWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      privateKey: '',
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  methods: {
    unlockBtn() {
      this.unlockPrivateKeyWallet(this.privateKey);
    }
  }
};
</script>

<style lang="scss" scoped>
.sheet-content {
  padding: 48px;
}
</style>
