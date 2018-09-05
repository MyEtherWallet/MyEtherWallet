<template>
  <b-modal 
    ref="privateKey" 
    hide-footer 
    class="bootstrap-modal modal-software" 
    title="PrivateKey" 
    centered>
    <form class="private-key-form">
      <div class="input-container">
        <input 
          v-model="privateKey" 
          type="text" 
          name="PrivateKey" 
          autocomplete="off" >
      </div>
      <button 
        :disabled=" privateKey === '' && privateKey.length === 0 && privateKey.length < 9" 
        class="submit-button large-round-button-green-filled" 
        type="submit" 
        @click.prevent="unlockWallet">
        Unlock Wallet
      </button>
    </form>
  </b-modal>
</template>

<script>
import Wallet from 'ethereumjs-wallet';

export default {
  data() {
    return {
      privateKey:
        '563070852154f171267e8a79111f299e42baeda3acd5f0cf82d92e5feba31dea'
    };
  },
  methods: {
    unlockWallet() {
      this.$store.dispatch(
        'decryptWallet',
        Wallet.fromPrivateKey(Buffer.from(this.privateKey, 'hex'))
      );
      this.privateKey = '';
      this.$router.push({ path: 'interface' });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrivateKeyModal.scss';
</style>
