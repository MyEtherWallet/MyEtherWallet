<template>
  <div class="wallet-side-menu">
    <div v-for="option in options" :key="option.label" class="wallet-menu">
      <img
        :src="selectedView === option.label ? option.icon : option.inActive"
      />
      <span>
        {{ option.name }}
      </span>
    </div>
  </div>
</template>

<script>
import byJsonImg from '@/assets/images/icons/button-json-hover.svg';
import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImg from '@/assets/images/icons/button-mnemonic-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
export default {
  props: {
    switchView: {
      type: Function,
      default: () => {}
    },
    selectedView: {
      type: String,
      default: 'myWallets'
    }
  },
  data() {
    return {
      options: [
        {
          name: 'My Wallets',
          icon: byJsonImg,
          inActive: byJsonImgHov,
          label: 'myWallets'
        },
        {
          name: 'Watch Only Wallets',
          icon: byMnemImg,
          inActive: byMnemImgHov,
          label: 'myWatchedWallets'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletSideMenu.scss';
</style>
