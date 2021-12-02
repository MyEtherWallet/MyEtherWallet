<template>
  <div class="default-header expandHeader">
    <div
      class="
        d-flex
        align-center
        justify-center
        pa-2
        tableHeader
        textBlack2--text
      "
    >
      Missing the old version?&nbsp;
      <a href="https://v5.myetherwallet.com" rel="noopener noreferrer">
        You can find version 5 here
      </a>
    </div>
    <v-container class="d-flex align-center pt-8">
      <v-row align="center" no-gutters>
        <v-col class="d-md-none" cols="4">
          <the-default-mobile-navigation class="ml-n2" />
        </v-col>
        <v-col cols="4">
          <router-link :to="{ name: ROUTES_HOME.HOME.NAME, query: {} }">
            <v-img
              :class="$vuetify.breakpoint.smAndDown ? 'mx-auto' : ''"
              src="@/assets/images/icons/logo-mew.svg"
              max-height="36"
              max-width="130"
            />
          </router-link>
        </v-col>
        <v-col class="justify-space-between d-none d-md-flex" cols="4">
          <router-link
            class="white--text text-decoration--none"
            :to="{ name: ROUTES_HOME.HOW_IT_WORKS.NAME }"
          >
            What is MEW
          </router-link>
          <mew-menu
            activator-text-color="white--text"
            :list-obj="menuObj"
            @goToPage="routeTo"
          />
          <a
            :href="swapLink"
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
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import { mapGetters } from 'vuex';

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
              to: { name: ROUTES_WALLET.SEND_TX.NAME }
            },
            {
              title: 'Explore DApps',
              to: { name: ROUTES_WALLET.DAPPS.NAME }
            },
            {
              title: 'Swap tokens',
              to: { name: ROUTES_WALLET.SWAP.NAME }
            },
            {
              title: 'Sign message',
              to: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME }
            }
          ]
        },
        {
          title: 'More actions',
          items: [
            {
              title: 'Verify message',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'verify' } }
            },
            {
              title: 'Convert units',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'convert' } }
            }
          ]
        }
      ]
    },
    ROUTES_HOME: ROUTES_HOME
  }),
  computed: {
    ...mapGetters('global', ['swapLink'])
  },
  methods: {
    routeTo(route) {
      this.$router.push(route);
    }
  }
};
</script>
