<template>
  <div class="add-wallet-container">
    <h3>Add My Wallet</h3>
    <p>How would you like to add your wallet?</p>
    <div class="add-wallet-options">
      <router-link
        v-for="(option, idx) in options"
        :to="option.link"
        :key="option.text + idx"
        class="wallet-option"
      >
        <img :src="option.icon" />
        <p>{{ option.text }}</p>
        <p>{{ option.warning }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          icon: '',
          text: 'Generate a New Wallet',
          link: '/generate',
          warning: ''
        },
        {
          icon: '',
          text: 'Mnemonic Phrase',
          link: '/mnemonic',
          warning: 'Not Recommended'
        },
        {
          icon: '',
          text: 'Private Key',
          link: '/private-key',
          warning: 'Not Recommended'
        },
        {
          icon: '',
          text: 'Keystore File (UTC/JSON)',
          link: '/keystore',
          warning: 'Not Recommended'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionAddWallet.scss';
</style>
