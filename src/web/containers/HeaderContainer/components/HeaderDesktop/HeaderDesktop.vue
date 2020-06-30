<template>
  <div class="bg_blue">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>
        <Menu :menus="menus" />
        <v-spacer></v-spacer>
        <mew-button
          class="pr-2 pl-4"
          title="Buy ETH"
          color-theme="white"
          :has-full-width="false"
          button-size="large"
          btn-style="outline"
          left-md-icon="mdi-view-grid"
          right-md-icon="mdi-chevron-down"
        />
        <mew6-std-btn
          v-if="false"
          depressed
          min-width="0"
          height="48px"
          outlined
          color="white"
          :to="{ name: 'HomeCreateWallet', params: {} }"
          custom-style="padding: 20px;"
        >
          <img
            height="30"
            src="@/assets/images/icons/icon-buy-eth-white.svg"
            class="mr-1 ml-n1"
          />Buy ETH
        </mew6-std-btn>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
import Menu from './components/Menu';
//import BuyEthIcon from '@/assets/images/icons/icon-buy-eth-white.svg';

export default {
  name: 'HeaderDesktop',
  components: { Menu },
  data: () => ({
    menus: [
      { label: 'How it works', to: '/how-it-works' },
      {
        label: 'Company',
        submenus: [
          { label: 'About us', to: '/about-us/company' },
          { label: 'Team', to: '/about-us/team' },
          { label: 'Support', href: 'https://kb.myetherwallet.com/' },
          { label: 'Blog', href: 'https://www.mewtopia.com/' }
        ]
      },
      {
        label: 'Tools',
        submenus: [
          { label: 'Watch only address', to: '/about-us/company' },
          { label: 'Send offline helper', to: '/about-us/team' },
          { label: 'Verify message', href: 'https://kb.myetherwallet.com/' },
          { label: 'Convert units', href: 'https://www.mewtopia.com/' }
        ]
      }
    ]
  })
};
</script>
