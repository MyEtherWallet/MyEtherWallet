<template>
  <div class="mew-component--landing-page-menu-mobile">
    <app-btn-menu @click.native="isOpen = !isOpen" />

    <v-navigation-drawer
      v-model="isOpen"
      absolute
      temporary
      color="expandHeader"
    >
      <v-list-item class="py-8 pl-2 pr-4">
        <v-btn large icon light @click="isOpen = false">
          <v-icon color="white" large>mdi-window-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-img
          src="@/assets/images/icons/logo-mew.svg"
          max-height="36"
          max-width="130"
          @click="pushRoute({ name: 'Home' })"
        />
        <v-spacer></v-spacer>
        <mew-tools />
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
                    class="pl-13 white--text font-weight-regular mew-body"
                  >
                    {{ child.label }}
                  </v-list-item-title>
                </a>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <v-list-item class="mb-3">
          <v-list-item-content @click="openMoonpay">
            <div class="mew-heading-2">Buy ETH</div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import mewTools from '@/components/mew-tools/MewTools';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import AppBtnMenu from '@/core/components/AppBtnMenu';
import { ROUTES_HOME, ROUTES_WALLET } from '@/core/configs/configRoutes';
import { mapGetters } from 'vuex';
export default {
  name: 'MobileMenu',
  components: { AppBtnMenu, mewTools },
  mixins: [buyMore],
  data: () => ({
    isOpen: false
  }),
  computed: {
    ...mapGetters('global', ['swapLink']),
    menu() {
      return [
        { label: 'How it works', to: { name: ROUTES_HOME.HOW_IT_WORKS.NAME } },
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
              label: 'Generate Keystore file',
              to: { name: ROUTES_HOME.TOOLS.NAME, query: { tool: 'keystore' } }
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
      this.$router.push(to).catch(() => true);
      this.isOpen = false;
    }
  }
};
</script>

<style scoped lang="scss">
.v-navigation-drawer {
  width: 100% !important;
  max-width: 500px;
}
</style>
