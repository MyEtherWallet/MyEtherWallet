<template>
  <div class="add-wallet-container">
    <h2>Add My Wallet</h2>
    <p>How would you like to add your wallet?</p>
    <div class="add-wallet-options">
      <access-wallet-button
        v-for="(button, index) in options"
        :key="button.title + index"
        :func="button.func"
        :img="button.icon"
        :title="button.title"
        :recommend="button.warning"
        :disabled="false"
        :classname="'extension-selection'"
      />
    </div>
  </div>
</template>

<script>
import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import privKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import generateImgHov from '@/assets/images/icons/button-generate-hover.svg';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton';

export default {
  components: {
    'access-wallet-button': AccessWalletButton
  },
  data() {
    return {
      options: [
        {
          icon: generateImgHov,
          title: 'Generate a New Wallet',
          warning: '',
          func: () => {
            console.log('REEEEEEEE');
          }
        },
        {
          icon: byMnemImgHov,
          title: 'Mnemonic Phrase',
          warning: 'Not Recommended',
          func: () => {
            console.log('REEEEEEEE');
          }
        },
        {
          icon: privKeyImgHov,
          title: `Private \n Key`,
          warning: 'Not Recommended',
          func: () => {
            console.log('REEEEEEEE');
          }
        },
        {
          icon: byJsonImgHov,
          title: 'Keystore File (UTC/JSON)',
          warning: 'Not Recommended',
          func: () => {
            console.log('REEEEEEEE');
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionAddWalletContainer.scss';
</style>
