<template>
  <b-modal
    ref="privateKey"
    :title="$t('accessWallet.accessByPrivateKey')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered>
    <div class="the-content">
      <form class="private-key-form">
        <div class="input-container">
          <input
            v-model="privateKey"
            type="text"
            name="PrivateKey"
            autocomplete="off" >
        </div>
        <standard-button 
          :options="buttonContinue"
        />
        <standard-button 
          :options="buttonDisabled"
        />

        
        <button
          :disabled=" privateKey === '' && privateKey.length === 0 && privateKey.length < 9"
          class="submit-button large-round-button-green-filled"
          type="submit"
          @click.prevent="unlockWallet">
          {{ $t("accessWallet.unlockWallet") }}
        </button>

      </form>
    </div>
  </b-modal>
</template>

<script>
import { BasicWallet } from '@/wallets';
export default {
  data() {
    return {
      buttonContinue: {
        title: 'Unlock Wallet',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      buttonDisabled: {
        title: 'Unlock Wallet',
        buttonStyle: 'grey',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true
      },
      privateKey:
        '563070852154f171267e8a79111f299e42baeda3acd5f0cf82d92e5feba31dea'
    };
  },
  methods: {
    unlockWallet() {
      this.$store.dispatch(
        'decryptWallet',
        BasicWallet.unlock({
          type: 'manualPrivateKey',
          manualPrivateKey: this.privateKey
        })
      );
      this.privateKey = '';
      this.$router.push({ path: 'interface' });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrivateKeyModal-desktop.scss';
@import 'PrivateKeyModal-tablet.scss';
@import 'PrivateKeyModal-mobile.scss';
</style>
