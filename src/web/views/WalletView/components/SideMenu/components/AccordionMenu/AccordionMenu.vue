<template>
  <div class="accordion-menu-container user-select--none">
    <v-list color="transparent">
      <div v-for="(i, key1) in menuItems" :key="key1">
        <v-list-item v-if="i.url">
          <div
            class="cursor--pointer d-flex align-center"
            @click="routerPush(i.url)"
          >
            <img width="26" height="26" :src="i.iconDark" class="mr-3" />
            <img width="23" height="23" :src="i.iconLight" class="mr-3" />
            <div>{{ i.name }}</div>
          </div>
        </v-list-item>

        <v-list-group v-else>
          <template v-slot:activator>
            <v-list-item-title class="cursor--pointer d-flex align-center">
              <img width="26" height="26" :src="i.iconDark" class="mr-3" />
              <img width="23" height="23" :src="i.iconLight" class="mr-3" />
              <div>{{ i.name }}</div>
            </v-list-item-title>
          </template>

          <v-list-item-content
            v-for="(c, key2) in i.children"
            :key="key2"
            class="py-2"
          >
            <div
              class="menu-sub-item cursor--pointer"
              @click="routerPush(c.url)"
            >
              {{ c.name }}
            </div>
          </v-list-item-content>
        </v-list-group>
      </div>
    </v-list>
  </div>
</template>

<script>
import DashboardLight from '@/assets/images/icons/icon-dashboard-enable.png';
import DashboardDark from '@/assets/images/icons/icon-dashboard-disable.png';

import SendLight from '@/assets/images/icons/icon-send-enable.png';
import SendDark from '@/assets/images/icons/icon-send-disable.png';

import SwapLight from '@/assets/images/icons/icon-swap-enable.png';
import SwapDark from '@/assets/images/icons/icon-swap-disable.png';

import DappCenterLight from '@/assets/images/icons/icon-dapp-center-enable.png';
import DappCenterDark from '@/assets/images/icons/icon-dapp-center-disable.svg';

import ContractLight from '@/assets/images/icons/icon-contract-enable.png';
import ContractDark from '@/assets/images/icons/icon-contract-disable.png';

import SignMessageLight from '@/assets/images/icons/icon-message-enable.png';
import SignMessageDark from '@/assets/images/icons/icon-message-disable.png';

export default {
  components: {},
  data() {
    return {
      currentURL: '',
      menuItems: [
        {
          name: 'Dashboard',
          iconDark: DashboardDark,
          iconLight: DashboardLight,
          url: '/wallet/dashboard'
        },
        {
          name: 'Send',
          iconDark: SendDark,
          iconLight: SendLight,
          children: [
            {
              name: 'Send Transaction',
              url: '/wallet/send/sendtx'
            },
            {
              name: 'Send Offline',
              url: '/wallet/send/send-offline'
            },
            {
              name: 'NFT Manager',
              url: '/wallet/send/nft-manager'
            }
          ]
        },
        {
          name: 'Swap',
          iconDark: SwapDark,
          iconLight: SwapLight,
          url: '/wallet/swap'
        },
        {
          name: 'Dapps Center',
          iconDark: DappCenterDark,
          iconLight: DappCenterLight,
          url: '/wallet/dapps'
        },
        {
          name: 'Contract',
          iconDark: ContractDark,
          iconLight: ContractLight,
          children: [
            {
              name: 'Interact with contract',
              url: '/wallet/contract/interact'
            },
            {
              name: 'Deploy contract',
              url: '/wallet/contract/deploy'
            }
          ]
        },
        {
          name: 'Sign Message',
          iconDark: SignMessageDark,
          iconLight: SignMessageLight,
          url: '/wallet/sign'
        }
      ]
    };
  },
  created() {
    this.currentURL = this.$route.path;
  },
  methods: {
    routerPush(url) {
      this.currentURL = url;
      this.$router.push({ path: url }, () => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-sub-item {
  padding-left: 51px;
}
</style>

<style lang="scss">
@import '@/assets/styles/GlobalVariables.scss';

.accordion-menu-container {
  .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: white !important;
  }

  .theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: $blue-1 !important;
  }

  .theme--dark.v-list-item.v-list-item--active {
    color: $emerald !important;
  }
}
</style>
