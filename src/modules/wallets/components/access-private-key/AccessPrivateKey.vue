<template>
  <div class="mt-5">
    <mew6-white-sheet class="pa-4 pa-lg-10">
      <h4 class="font-weight-bold mb-6">Enter my private key</h4>
      <mew-input
        v-model="privateKey"
        label="Private Key"
        placeholder="Enter my Private Key"
      />
      <div class="text-center">
        <mew-checkbox
          v-model="acceptTerms"
          label="To access my wallet, I accept "
          :link="link"
          class="justify-center"
        />
        <mew-button
          title="Access my wallet"
          btn-size="xlarge"
          :disabled="!disableBtn"
          @click.native="unlockBtn"
        />
      </div>
    </mew6-white-sheet>
  </div>
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
