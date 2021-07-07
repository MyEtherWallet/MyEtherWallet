<template>
  <div class="default-header expandHeader">
    <v-container class="d-flex align-center pt-8">
      <v-row align="center" no-gutters>
        <v-col class="d-md-none" cols="4">
          <the-default-mobile-navigation class="ml-n2" />
        </v-col>
        <v-col cols="4">
          <router-link :to="{ name: 'Home', query: {} }">
            <v-img
              :class="$vuetify.breakpoint.smAndDown ? 'mx-auto' : ''"
              src="@/assets/images/icons/logo-mew.png"
              max-height="36"
              max-width="130"
            />
          </router-link>
        </v-col>
        <v-col class="justify-space-between d-none d-md-flex" cols="4">
          <router-link
            class="white--text text-decoration--none"
            :to="{ name: 'HowItWorks' }"
          >
            What is MEW
          </router-link>
          <mew-menu
            text-color="white--text"
            :list-obj="menuObj"
            @goToPage="routeTo"
          />
          <a
            href="https://ccswap.myetherwallet.com/#/"
            target="_blank"
            class="white--text text-decoration--none"
          >
            Buy ETH
          </a>
        </v-col>
        <v-col cols="4" class="text-right">
          <mew-tools class="ml-auto" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import mewTools from '@/components/mew-tools/MewTools';
import TheDefaultMobileNavigation from './TheDefaultMobileNavigation';

export default {
  name: 'TheDefaultHeader',
  components: { mewTools, TheDefaultMobileNavigation },
  data: () => ({
    menuObj: {
      name: 'Wallet actions',
      items: [
        {
          title: 'Popular actions',
          items: [
            {
              title: 'Send transaction',
              to: { name: 'SendTX' }
            },
            {
              title: 'Explore DApps',
              to: { name: 'Dapps' }
            },
            {
              title: 'Swap tokens',
              to: { name: 'Swap' }
            },
            {
              title: 'Sign message',
              to: { name: 'SignMessage' }
            }
          ]
        },
        {
          title: 'More actions',
          items: [
            {
              title: 'Verify message',
              to: { name: 'Tools', query: { tab: '1' } }
            }
          ]
        }
      ]
    }
  }),
  methods: {
    routeTo(route) {
      this.$router.push(route);
    }
  }
};
</script>
