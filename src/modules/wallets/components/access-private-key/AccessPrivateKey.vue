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
            <v-col align="center" justify="center">
              <mew-button
                title="Access My Wallet"
                button-size="large"
                :disabled="!disableBtn"
                @click.native="unlockBtn"
              />
              <mew-checkbox
                v-model="acceptTerms"
                label="To access my wallet, I accept "
                :link="link"
                class="justify-center"
              />
            </v-col>
          </v-container>
        </div>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { isHexString } from 'ethereumjs-util';
export default {
  name: 'AccessPrivateKey',
  props: {
    unlockPrivateKeyWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      privateKey: '',
      acceptTerms: false,
      link: {
        title: 'Terms',
        url: 'https://www.myetherwallet.com/terms-of-service'
      }
    };
  },
  computed: {
    disableBtn() {
      return this.acceptTerms && this.isPrivKey;
    },
    isPrivKey() {
      const _priv = this.privateKey.replace('0x', '');
      return isHexString('0x' + _priv, 32) && this.privateKey !== '';
    },
    actualPrivateKey() {
      return this.privateKey.substr(0, 2) === '0x'
        ? this.privateKey.replace('0x', '')
        : this.privateKey;
    }
  },
  methods: {
    unlockBtn() {
      this.unlockPrivateKeyWallet(this.actualPrivateKey);
      this.privateKey = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.sheet-content {
  padding: 48px;
}
</style>
