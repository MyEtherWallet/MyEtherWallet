<template>
  <div class="default-header expandHeader">
    <menu-mobile v-model="openMobileMenu" />
    <mew-tools v-model="mewTools" />
    <v-container fluid class="d-flex align-center py-2">
      <v-row align="center" no-gutters>
        <v-col class="d-flex d-md-none" cols="4">
          <app-btn-menu :menu-method="openMobile" />
        </v-col>
        <v-col class="pl-md-14" cols="4">
          <router-link :to="{ name: 'Home', query: {} }">
            <v-img
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
            How it works
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
        <v-col
          cols="4"
          :class="$vuetify.breakpoint.mdAndUp ? 'text-center' : 'text-right'"
        >
          <mew-button
            class="px-2"
            :title="$vuetify.breakpoint.mdAndUp ? 'MEW tools' : ''"
            color-theme="white"
            :has-full-width="false"
            btn-size="large"
            btn-style="outline"
            :icon="
              $vuetify.breakpoint.mdAndUp
                ? 'mdi-view-module'
                : require('@/assets/images/icons/icon-grid-dot.png')
            "
            :icon-type="$vuetify.breakpoint.mdAndUp ? 'mdi' : 'img'"
            icon-align="left"
            @click.native="mewTools = true"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import mewTools from '@/components/mewTools/MewTools';
import MenuMobile from '@/components/menu-mobile/Menu'; // will remove this after adding mobile version to mew-menu
import AppBtnMenu from '@/core/components/AppBtnMenu';

export default {
  name: 'TheDefaultHeader',
  components: { mewTools, MenuMobile, AppBtnMenu },
  data: () => ({
    mewTools: false,
    openMobileMenu: false,
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
              title: 'Explore Dapps',
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
              title: 'Watch only address',
              to: { name: 'Tools', query: { tab: '1' } }
            },
            {
              title: 'Send offline helper',
              to: { name: 'Tools', query: { tab: '2' } }
            },
            {
              title: 'Verify message',
              to: { name: 'Tools', query: { tab: '3' } }
            },
            {
              title: 'Convery units',
              to: { name: 'Tools', query: { tab: '4' } }
            }
          ]
        }
      ]
    }
  }),
  methods: {
    routeTo(route) {
      this.$router.push(route);
    },
    openMobile() {
      this.openMobileMenu = true;
    }
  }
};
</script>

<style lang="scss">
// adding mew menu styles here for now, will apply it to mew components
.v-application {
  .mew-menu-content {
    min-width: 200px !important;

    .v-list {
      padding-top: 15px !important;

      .v-list-item {
        min-height: 30px !important;
      }
      .v-list-item--link {
        padding-top: 0 !important;
        padding-bottom: 5px !important;
      }
    }
  }
}
</style>
