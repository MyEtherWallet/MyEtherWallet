<template>
  <div
    ref="menu"
    class="mew-component--accordion-menu-container user-select--none"
  >
    <div v-for="(mainItems, mainKey) in menuItems" :key="mainKey">
      <!-- Main menus ======================================== -->
      <div
        :ref="getMenuRef('main' + mainItems.url)"
        class="main-menu cursor--pointer d-flex align-center px-3 py-2"
        @click="routerPush(mainItems.url)"
      >
        <img
          class="dark mr-3"
          width="26"
          height="26"
          :src="mainItems.iconDark"
        />
        <img
          class="light mr-3"
          width="26"
          height="26"
          :src="mainItems.iconLight"
        />
        <div>{{ mainItems.name }}</div>
        <v-icon v-if="mainItems.children" class="ml-auto dark">
          mdi-chevron-down
        </v-icon>
        <v-icon v-if="mainItems.children" class="ml-auto light">
          mdi-chevron-up
        </v-icon>
      </div>

      <!-- Sub menus ======================================== -->
      <div v-if="mainItems.children" class="sub-menu">
        <div
          v-for="(subItems, subKey) in mainItems.children"
          :key="subKey"
          :ref="getMenuRef(subItems.url)"
          class="cursor--pointer pl-12 pr-3 py-1"
          @click="routerPush(subItems.url)"
        >
          <span class="pl-2">{{ subItems.name }}</span>
        </div>
      </div>
    </div>
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
  data() {
    return {
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
          url: '/wallet/send/sendtx',
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
          name: 'Dapps',
          iconDark: DappCenterDark,
          iconLight: DappCenterLight,
          url: '/wallet/dapps/dapps-center',
          children: [
            {
              name: 'Dapps Center',
              url: '/wallet/dapps/dapps-center'
            },
            {
              name: 'ENS manager',
              url: '/wallet/dapps/ens-manager'
            },
            {
              name: 'MakerDAO',
              url: '/wallet/dapps/maker-dao'
            },
            {
              name: 'Aave',
              url: '/wallet/dapps/aave'
            },
            {
              name: 'Ambrpay',
              url: '/wallet/dapps/ambrpay'
            },
            {
              name: 'Unstoppable Domain',
              url: '/wallet/dapps/unstoppable-domain'
            }
          ]
        },
        {
          name: 'Contract',
          iconDark: ContractDark,
          iconLight: ContractLight,
          url: '/wallet/contract/interact',
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
  watch: {
    $route() {
      this.markActiveMenu();
    }
  },
  mounted() {
    this.markActiveMenu();
  },
  methods: {
    removeActiveClasses() {
      const allActiveClasses = this.$refs['menu'].querySelectorAll('.active');
      for (let i = 0; i < allActiveClasses.length; i++) {
        allActiveClasses[i].classList.remove('active');
      }
    },
    markActiveMenu() {
      this.removeActiveClasses();

      const menuItemRef = this.getMenuRef(this.$route.path);

      if (this.$refs[menuItemRef]) {
        this.$refs[menuItemRef][0].classList.add('active');
        this.$refs[menuItemRef][0].parentNode.parentNode.classList.add(
          'active'
        );
      } else {
        this.$refs['main' + menuItemRef][0].parentNode.classList.add('active');
      }
    },
    getMenuRef(url) {
      return url.replace(/[^\w\s]/gi, '_');
    },
    routerPush(url) {
      this.$router.push({ path: url }, () => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.main-menu:hover,
.sub-menu > *:hover {
  background-color: #0000001f;
}

.main-menu,
.sub-menu {
  * {
    color: var(--v-gray_text-base);
  }
}
.active {
  .main-menu * {
    color: white;
  }
}

.sub-menu {
  max-height: 0px;
  overflow: hidden;
  transition: all 0.2s ease;
  .active * {
    color: white;
  }
}

.active .sub-menu {
  max-height: 200px;
}

.light {
  display: none;
}

.active {
  .light {
    display: block;
  }

  .dark {
    display: none;
  }
}
</style>
