<template>
  <div class="bg_blue py-5">
    <v-container class="d-flex align-center">
      <router-link :to="{ name: 'Home', query: {} }">
        <v-img src="@/assets/images/icons/logo-mew.png" max-width="130" />
      </router-link>
      <v-spacer></v-spacer>
      <Menu />
      <v-spacer></v-spacer>
      <mew-button
        class="px-2"
        title="MEW tools"
        color-theme="white"
        :has-full-width="false"
        button-size="large"
        btn-style="outline"
        icon="mdi-view-module"
        icon-type="mdi"
        icon-align="left"
      />
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
