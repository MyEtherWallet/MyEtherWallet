<template>
  <div class="mew-component--landing-page-menu-mobile">
    <app-btn-menu @click.native="isOpen = !isOpen" />

    <v-navigation-drawer
      v-model="isOpen"
      width="280px"
      absolute
      temporary
      color="white"
    >
      <div class="pa-5" style="position: relative">
        <v-btn class="close-button" large icon light @click="isOpen = false">
          <v-icon color="textDark">mdi-window-close</v-icon>
        </v-btn>
        <img
          src="@/assets/images/icons/icon-mew-dark.svg"
          height="36"
          @click="pushRoute({ name: 'Home' })"
        />
      </div>

      <v-list color="white" class="px-2">
        <template v-for="(item, index) in menu">
          <v-list-item v-if="!item.sub" :key="index">
            <v-list-item-content v-if="item.to" @click="pushRoute(item.to)">
              <div class="mew-heading-3 font-weight-medium textDark--text">
                {{ item.label }}
              </div>
            </v-list-item-content>
            <a
              v-if="item.url"
              :href="item.url"
              target="_blanks"
              @click="isOpen = false"
            >
              <v-list-item-content class="textDark--text">
                <div class="mew-heading-3 font-weight-medium textDark--text">
                  {{ item.label }}
                </div>
              </v-list-item-content>
            </a>
          </v-list-item>

          <v-list-group v-if="item.sub" :key="index" prepend-icon="">
            <template #activator>
              <v-list-item-content>
                <div class="mew-heading-3 font-weight-medium textDark--text">
                  {{ item.label }}
                </div>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, ckey) in item.sub"
              :key="ckey"
              dense
              class="pl-4"
            >
              <v-list-item-content>
                <v-list-item-title
                  v-if="child.to"
                  class="pl-4 textDark--text font-weight-regular mew-body"
                  @click="pushRoute(child.to)"
                >
                  {{ child.label }}
                </v-list-item-title>
                <a
                  v-if="child.url"
                  :href="child.url"
                  target="_blanks"
                  @click="isOpen = false"
                >
                  <v-list-item-title
                    class="pl-13 textDark--text font-weight-regular mew-body"
                  >
                    {{ child.label }}
                  </v-list-item-title>
                </a>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <v-list-item>
          <v-list-item-content @click="trackBuySell">
            <div class="mew-heading-3 font-weight-medium textDark--text">
              Buy ETH
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <div class="mew-heading-3 font-weight-medium textDark--text mb-6">
              Products
            </div>
            <a
              v-for="(product, keyProduct) in mewProducts"
              :key="keyProduct"
              :href="product.link"
              target="_blank"
              class="d-flex align-center mb-5 ml-5"
              @click="trackToolLink(product)"
            >
              <img
                width="35"
                :src="product.img"
                :alt="product.label"
                class="mr-3"
              />
              <div class="mew-heading-3 font-weight-medium textDark--text">
                {{ product.label }}
              </div>
            </a>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="pa-4 bottom-buttons">
        <mew-button
          btn-size="large"
          has-full-width
          title="Create a new wallet"
          class="mb-2"
          @click.native="trackMobileCreate"
        ></mew-button>
        <mew-button
          btn-style="outline"
          btn-size="large"
          has-full-width
          title="Access my wallet"
          @click.native="trackMobileAccess"
        ></mew-button>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
export default {
  name: 'MobileMenu',
  components: {
    AppBtnMenu: () => import('@/core/components/AppBtnMenu')
  },
  mixins: [buyMore, handlerAnalytics],
  data: () => ({
    isOpen: false,
    mewProducts: [
      {
        label: 'MEW web',
        description: 'Ethereum desktop wallet',
        img: require('@/assets/images/icons/icon-mew-logo.svg'),
        link: 'https://www.myetherwallet.com/'
      },
      {
        label: 'MEW wallet',
        imgDescription: {
          icons: [
            require('@/assets/images/icons/icon-apple.svg'),
            require('@/assets/images/icons/icon-google.svg')
          ],
          label: 'Get the app'
        },
        img: require('@/assets/images/icons/icon-mew-wallet.png'),
        link: 'https://www.mewwallet.com/'
      },
      {
        label: 'Enkrypt',
        imgDescription: {
          icons: [require('@/assets/images/icons/icon-chrome.svg')],
          label: 'Get the extension'
        },
        img: require('@/assets/images/icons/icon-enkrypt-block.svg'),
        link: 'https://www.enkrypt.com'
      },

      {
        label: 'EthVM',
        description: 'Blockchain explorer',
        img: require('@/assets/images/icons/icon-ethvm.svg'),
        link: 'https://www.ethvm.com/'
      },
      {
        label: 'MEWtopia',
        description: 'Education Blog',
        img: require('@/assets/images/icons/icon-puppy-mew.svg'),
        link: 'https://www.mewtopia.com/'
      },
      {
        label: 'Help Center',
        description: 'How to use MEW products',
        img: require('@/assets/images/icons/icon-customer-support.svg'),
        link: 'https://help.myetherwallet.com/'
      }
    ]
  }),
  computed: {
    ...mapGetters('global', ['swapLink']),
    menu() {
      return [
        {
          label: this.$t('header.what-is-mew'),
          to: { name: ROUTES_HOME.HOW_IT_WORKS.NAME }
        },
        {
          label: 'Popular actions',
          sub: [
            {
              label: 'Send transaction',
              to: { name: ROUTES_WALLET.SEND_TX.NAME }
            },
            {
              label: 'Explore DApps',
              to: { name: ROUTES_WALLET.DAPPS.NAME }
            },
            {
              label: 'Swap tokens',
              to: { name: ROUTES_WALLET.SWAP.NAME }
            },
            {
              label: 'Sign message',
              to: { name: ROUTES_WALLET.SIGN_MESSAGE.NAME }
            }
          ]
        },
        {
          label: 'More actions',
          sub: [
            {
              label: 'Verify message',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'verify' } }
            },
            {
              label: 'Convert Units',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'convert' } }
            },
            {
              label: 'Send Offline Helper',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'offline' } }
            }
          ]
        }
      ];
    }
  },
  methods: {
    pushRoute(to) {
      this.trackHeaderAmplitude(`${to.name}Mobile`);
      this.$router.push(to).catch(() => true);
      this.isOpen = false;
    },
    trackBuySell() {
      this.trackHeaderAmplitude('BuyETHMobile');
      this.openBuySell();
    },
    trackMobileAccess() {
      this.trackLandingPageAmplitude('AccessWalletMobile');
      this.$router.push({
        name: ROUTES_HOME.ACCESS_WALLET.NAME,
        params: {}
      });
    },
    trackMobileCreate() {
      this.trackLandingPageAmplitude('CreateWalletMobile');
      this.$router.push({
        name: ROUTES_HOME.CREATE_WALLET.NAME,
        params: {}
      });
    },
    trackToolLink(val) {
      const parsedLabel = val.label.replace(' ', '');
      this.trackHeaderAmplitude(`${parsedLabel}Mobile`);
    }
  }
};
</script>

<style scoped lang="scss">
.close-button {
  position: absolute;
  right: 10px;
  top: 16px;
}
.bottom-buttons {
  background-color: var(--v-greyLight-base);
}
</style>

<style lang="scss">
.mew-component--landing-page-menu-mobile {
  .theme--light.v-icon {
    color: var(--v-textDark-base) !important;
  }
  .v-list-item--dense .v-list-item__title {
    line-height: 18px !important;
  }
  .v-navigation-drawer__content {
    height: 100vh;
  }
}
</style>
