<template>
  <div class="mew-component--landing-page-menu-mobile">
    <app-btn-menu @click.native="openMobileMenu" />

    <v-navigation-drawer
      v-model="isOpen"
      absolute
      temporary
      color="expandHeader"
    >
      <v-list-item class="pt-8 pb-8 pl-4 pr-1">
        <v-img
          class="mx-auto"
          src="@/assets/images/icons/logo-mew.png"
          max-height="36"
          max-width="130"
          @click="pushRoute({ name: 'Home' })"
        />

        <v-spacer></v-spacer>

        <v-btn x-large icon light @click="isOpen = false">
          <v-icon color="white" large>mdi-window-close</v-icon>
        </v-btn>
      </v-list-item>

      <v-list color="expandHeader" dark class="px-2">
        <template v-for="(item, index) in menu">
          <v-list-item v-if="!item.sub" :key="index" class="mb-3">
            <v-list-item-content v-if="item.to" @click="pushRoute(item.to)">
              <div class="mew-heading-2">{{ item.label }}</div>
            </v-list-item-content>
            <a
              v-if="item.url"
              :href="item.url"
              target="_blanks"
              @click="isOpen = false"
            >
              <v-list-item-content class="white--text">
                <div class="mew-heading-2">{{ item.label }}</div>
              </v-list-item-content>
            </a>
          </v-list-item>

          <v-list-group
            v-if="item.sub"
            :key="index"
            prepend-icon=""
            color="white"
            class="mb-3"
          >
            <template #activator>
              <v-list-item-content>
                <div class="mew-heading-2">{{ item.label }}</div>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, ckey) in item.sub"
              :key="ckey"
              style="background-color: var(--v-expandHeader-base) !important"
              dense
              class="pl-4"
            >
              <v-list-item-content>
                <v-list-item-title
                  v-if="child.to"
                  class="pl-4 white--text font-weight-regular mew-body"
                  @click="pushRoute(child.to)"
                  v-text="child.label"
                ></v-list-item-title>
                <a
                  v-if="child.url"
                  :href="child.url"
                  target="_blanks"
                  @click="isOpen = false"
                >
                  <v-list-item-title
                    class="pl-13 white--text font-weight-regular mew-body"
                    v-text="child.label"
                  ></v-list-item-title>
                </a>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import AppBtnMenu from '@/core/components/AppBtnMenu';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  name: 'MobileMenu',
  components: { AppBtnMenu },
  data: () => ({
    isOpen: false,
    menu: [
      { label: 'How it works', to: { name: ROUTES_HOME.HOW_IT_WORKS.NAME } },
      {
        label: 'Popular',
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
        label: 'More',
        sub: [
          {
            label: 'Verify message',
            to: { name: 'Tools', query: { tab: '3' } }
          }
          /*
          {
            label: 'Watch only address',
            to: { name: ROUTES_HOME.TOOLS.NAME, query: { tab: '1' } }
          },
          {
            label: 'Send offline helper',
            to: { name: ROUTES_HOME.TOOLS.NAME, query: { tab: '2' } }
          },
          {
            label: 'Convery units',
            to: { name: ROUTES_HOME.TOOLS.NAME, query: { tab: '4' } }
          }
          */
        ]
      },
      { label: 'Buy ETH', url: 'https://ccswap.myetherwallet.com' }
    ]
  }),
  methods: {
    pushRoute(to) {
      this.$router.push(to).catch(() => true);
      this.isOpen = false;
    },
    openMobileMenu() {
      this.isOpen = true;
    }
  }
};
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.mew-component--landing-page-menu-mobile {
  .mobile-menu-button .v-icon.v-icon {
    font-size: 43px;
  }
  .v-list-group__header,
  .v-list-item {
    border-top: 0 !important;
  }
  .theme--dark.v-list-item:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
    cursor: pointer;
  }
}
</style>
