<template>
  <div class="wallet-side-menu">
    <div
      v-for="option in options"
      :key="option.label"
      :class="[shouldBeActive(option.label) ? 'active' : '', 'wallet-menu']"
      @click="navigateTo(option.path)"
    >
      <div class="icon-block">
        <img
          :src="shouldBeActive(option.label) ? option.icon : option.inActive"
          width="20"
          height="20"
        />
      </div>
      <span class="menu-name">
        {{ option.name }}
      </span>
    </div>
  </div>
</template>

<script>
import myWallets from '@/assets/images/icons/button-generate.svg';
import myWalletsHov from '@/assets/images/icons/button-generate-hover.svg';
import favorite from '@/assets/images/icons/favorites.svg';
import favoriteHov from '@/assets/images/icons/favorites-hov.svg';
import dapp from '@/assets/images/sidemenu/dapps.svg';
import dappHov from '@/assets/images/sidemenu/dapps-active.svg';
export default {
  data() {
    return {
      options: [
        {
          name: 'Wallets',
          icon: myWalletsHov,
          inActive: myWallets,
          label: 'myWallets',
          path: '/'
        },
        {
          name: 'My Favorites',
          icon: favoriteHov,
          inActive: favorite,
          label: 'favorites',
          path: '/favorites'
        },
        {
          name: 'Dapps',
          icon: dappHov,
          inActive: dapp,
          label: 'dapps',
          path: '/dapps'
        }
      ]
    };
  },
  methods: {
    shouldBeActive(label) {
      if (label === 'dapps' && this.$route.fullPath.includes('dapps'))
        return true;
      if (label === 'favorites' && this.$route.fullPath.includes('favorites'))
        return true;
      if (
        label === 'myWallets' &&
        (this.$route.fullPath.includes('wallets') || this.$route.path === '/')
      )
        return true;
      return false;
    },
    navigateTo(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletSideMenu.scss';
</style>
