<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>
        <div class="menu-container d-flex align-center">
          <a href="#/how-it-works" class="white--text no-decoration">
            How It Works
          </a>
          <mew-menu
            :list-obj="companyDropdown"
            text-color="white--text"
            @goToPage="goToPage"
          />
          <mew-menu
            :list-obj="toolsDropdown"
            text-color="white--text"
            @goToPage="goToPage"
          />
        </div>

        <v-spacer></v-spacer>
        <mew-button
          btn-link="https://ccswap.myetherwallet.com"
          :has-full-width="false"
          title="Buy ETH"
          :icon="icons.buyEth"
          icon-align="left"
          btn-style="outline"
          color-theme="white"
        />
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
import wallet from '@/assets/images/icons/icon-wallet-grey.svg';
import send from '@/assets/images/icons/icon-send-grey.svg';
import message from '@/assets/images/icons/icon-message-grey.svg';
import eth from '@/assets/images/currencies//icon-eth-grey.svg';
import buyEth from '@/assets/images/icons/icon-buy-eth-white.svg';
import grabber from '@/assets/images/icons/icon-grabber-grey.svg';
import privatekey from '@/assets/images/icons/icon-private-key-grey.svg';
import ensDebugger from '@/assets/images/icons/icon-ens-debugger-grey.svg';
import sha3 from '@/assets/images/icons/icon-sha3-grey.svg';
import convert from '@/assets/images/icons/icon-convert-grey.svg';
export default {
  name: 'HeaderDesktop',
  data: () => ({
    companyDropdown: {
      name: 'Company',
      items: [
        { title: 'About us', to: '' },
        { title: 'Team', to: '' },
        { title: 'Support', to: '' },
        { title: 'Blog', to: '' }
      ]
    },
    toolsDropdown: {
      name: 'Tools',
      items: [
        { title: 'Watch only address', to: '' },
        { title: 'Send offline helper', to: '' },
        { title: 'Verify message', to: '' },
        { title: 'Convert units', to: '' }
      ]
    },
    icons: {
      wallet: wallet,
      send: send,
      message: message,
      eth: eth,
      grabber: grabber,
      privatekey: privatekey,
      ensDebugger: ensDebugger,
      sha3: sha3,
      convert: convert,
      buyEth: buyEth
    }
  }),
  methods: {
    goToPage(route) {
      this.$router.push({
        name: route
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  justify-content: space-evenly;
  width: 50%;
}
.theme--dark.v-btn:hover::before,
.theme--dark.v-btn::before {
  opacity: 0;
}
</style>
