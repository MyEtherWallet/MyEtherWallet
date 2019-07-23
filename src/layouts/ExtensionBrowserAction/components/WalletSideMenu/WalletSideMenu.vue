<template>
  <div class="wallet-side-menu">
    <div
      v-for="option in options"
      :key="option.label"
      :class="[selectedView === option.label ? 'active' : '', 'wallet-menu']"
      @click="switchView(option)"
    >
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
import myWallets from '@/assets/images/icons/button-generate.svg';
import myWalletsHov from '@/assets/images/icons/button-generate-hover.svg';
import watchOnly from '@/assets/images/icons/hide-password.svg';
import watchOnlyHov from '@/assets/images/icons/show-password.svg';
export default {
  props: {
    switchView: {
      type: Function,
      default: () => {}
    },
    selectedView: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [
        {
          name: 'My Wallets',
          icon: myWalletsHov,
          inActive: myWallets,
          label: 'myWallets'
        },
        {
          name: 'Watch-Only Wallets',
          icon: watchOnlyHov,
          inActive: watchOnly,
          label: 'watchOnlyWallets'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletSideMenu.scss';
</style>
