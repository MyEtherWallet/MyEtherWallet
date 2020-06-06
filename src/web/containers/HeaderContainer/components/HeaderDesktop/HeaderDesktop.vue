<template>
  <div class="light-blue darken-4">
    <v-container>
      <v-app-bar color="transparent" dark flat>
        <router-link :to="{ name: 'Home', query: {} }">
          <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
        </router-link>
        <v-spacer></v-spacer>
        <Menu :menus="menus" />
        <v-spacer></v-spacer>
        <v-btn class="white--text" large depressed outlined>
          <v-img
            src="@/assets/images/icons/icon-buy-eth-white.svg"
            class="mr-1 ml-n1"
          />Buy ETH
        </v-btn>
      </v-app-bar>
    </v-container>
  </div>
</template>

<script>
import Menu from './components/Menu';

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
