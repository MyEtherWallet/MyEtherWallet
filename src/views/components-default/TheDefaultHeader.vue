<template>
  <div class="default-header expandHeader">
    <v-container class="pl-4 pb-7 pr-4 d-flex align-center pt-8">
      <v-row align="center" no-gutters>
        <v-col class="d-md-none" cols="2" md="4">
          <the-default-mobile-navigation class="ml-n2" />
        </v-col>
        <v-col cols="8" md="8" class="d-flex align-center">
          <v-img
            :class="$vuetify.breakpoint.smAndDown ? 'mx-auto' : ''"
            class="cursor--pointer mr-md-14"
            src="@/assets/images/icons/logo-mew.svg"
            max-height="36"
            max-width="130"
            @click="routeToHome"
          />

          <div class="d-none d-md-flex">
            <router-link
              class="white--text text-decoration--none menu-item"
              :to="{ name: ROUTES_HOME.HOW_IT_WORKS.NAME }"
              @click="trackHowItWorks"
            >
              {{ $t('header.what-is-mew') }}
            </router-link>
            <div class="mx-8">
              <mew-menu
                top-arrow
                activator-text-color="white--text"
                :list-obj="menuObj"
                @goToPage="routeTo"
              />
            </div>
            <div @click="trackBuySellLanding">
              <a
                class="white--text text-decoration--none menu-item"
                @click="openBuySell"
              >
                {{ $t('header.buy-eth') }}
              </a>
            </div>
          </div>
        </v-col>
        <v-col cols="2" md="4" class="d-flex justify-end">
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
import { mapGetters, mapActions } from 'vuex';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'TheDefaultHeader',
  components: { mewTools, TheDefaultMobileNavigation },
  mixins: [buyMore, handlerAnalytics],
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
              title: 'Convert Units',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'convert' } }
            },
            {
              title: 'Send Offline Helper',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'offline' } }
            }
          ]
        }
      ]
    },
    ROUTES_HOME: ROUTES_HOME
  }),
  computed: {
    ...mapGetters('global', ['swapLink', 'network'])
  },
  mounted() {
    if (!this.network) return;
    this.network.type.tokens.then(res => {
      const tokenMap = new Map();
      res.forEach(item => {
        tokenMap.set(item.address.toLowerCase(), item);
      });
      this.setNetworkTokens(tokenMap);
    });
  },
  methods: {
    ...mapActions('external', ['setNetworkTokens']),
    routeToHome() {
      this.trackHeaderAmplitude('click_mew_logo');
      this.$router.push({ name: ROUTES_HOME.HOME.NAME });
    },
    trackHowItWorks() {
      this.trackHeaderAmplitude('click_what_is_mew');
    },
    routeTo(route) {
      this.trackHeaderAmplitude(`click_${route.name.toLowerCase()}`);
      this.$router.push(route);
    },
    trackBuySellLanding() {
      this.trackHeaderAmplitude('click_buy_sell');
      this.trackBuySell('buySellLanding');
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-item:hover {
  font-weight: 500;
}
</style>
