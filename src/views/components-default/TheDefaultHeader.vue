<template>
  <div class="default-header expandHeader">
    <v-container class="d-flex align-center pt-8">
      <v-row align="center" no-gutters>
        <v-col class="d-md-none" cols="4">
          <menu-mobile />
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
        <v-col cols="4" class="text-right">
          <mew-tools class="ml-auto" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import mewTools from '@/components/mew-tools/MewTools';
import MenuMobile from '@/components/menu-mobile/Menu'; // will remove this after adding mobile version to mew-menu

export default {
  name: 'TheDefaultHeader',
  components: { mewTools, MenuMobile },
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
