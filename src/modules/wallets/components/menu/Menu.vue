<template>
  <div
    ref="menu"
    class="mew-component--accordion-menu-container user-select--none"
  >
    <div
      v-for="(mainItems, mainKey) in menuItems"
      :key="mainKey"
      class="inactive mb-1"
    >
      <!-- Main menus ======================================== -->
      <div
        :ref="'main' + mainItems.routeName"
        class="main-menu cursor--pointer d-flex align-center px-3 py-2"
        @click="routerPush(mainItems.routeName)"
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
        <div class="d-none d-lg-block">{{ mainItems.name }}</div>
        <h3 class="d-block d-lg-none">{{ mainItems.name }}</h3>
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
          :ref="subItems.routeName"
          class="cursor--pointer pl-12 pr-3 py-2"
          @click="routerPush(subItems.routeName)"
        >
          <span class="d-none d-lg-block pl-2">{{ subItems.name }}</span>
          <h4 class="d-block d-lg-none pl-2">{{ subItems.name }}</h4>
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
          routeName: 'Dashboard'
        },
        {
          name: 'Send',
          iconDark: SendDark,
          iconLight: SendLight,
          routeName: 'SendTX',
          children: [
            {
              name: 'Send Transaction',
              routeName: 'SendTX'
            },
            {
              name: 'Send Offline',
              routeName: 'SendOffline'
            }
            /*
            {
              name: 'NFT Manager',
              routeName: 'NFTManager'
            }
            */
          ]
        },
        {
          name: 'Swap',
          iconDark: SwapDark,
          iconLight: SwapLight,
          routeName: 'Swap'
        },
        {
          name: 'Dapps',
          iconDark: DappCenterDark,
          iconLight: DappCenterLight,
          routeName: 'DappsCenter',
          children: [
            {
              name: 'Dapps Center',
              routeName: 'DappsCenter'
            },
            {
              name: 'ENS manager',
              routeName: 'NameManager'
            },
            {
              name: 'MakerDAO',
              routeName: 'MakerDAO'
            },
            {
              name: 'Aave',
              routeName: 'Aave'
            },
            {
              name: 'Ambrpay',
              routeName: 'Ambrpay'
            },
            {
              name: 'Unstoppable Domain',
              routeName: 'UnstoppableDomain'
            }
          ]
        },
        {
          name: 'Contract',
          iconDark: ContractDark,
          iconLight: ContractLight,
          routeName: 'InteractWithContract',
          children: [
            {
              name: 'Interact with contract',
              routeName: 'InteractWithContract'
            },
            {
              name: 'Deploy contract',
              routeName: 'DeployContract'
            }
          ]
        },
        {
          name: 'Sign Message',
          iconDark: SignMessageDark,
          iconLight: SignMessageLight,
          routeName: 'SignMessage'
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

      const menuItemRef = this.$route.name;

      if (this.$refs[menuItemRef]) {
        // Mark active main menu and submenu
        this.$refs[menuItemRef][0].classList.add('active');
        this.$refs[menuItemRef][0].parentNode.parentNode.classList.add(
          'active'
        );
      } else {
        // If there is no matching submenu, make main menu
        this.$refs['main' + menuItemRef][0].parentNode.classList.add('active');
      }
    },
    routerPush(routeName) {
      this.$emit('route-change');
      this.$router.push({ name: routeName, params: {} });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-menu:hover,
.sub-menu > *:hover {
  background-color: #0000001f;
}

.inactive {
  .main-menu,
  .sub-menu {
    * {
      color: var(--v-searchText-base);
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

  .light {
    display: none;
  }
}

.active {
  .main-menu * {
    color: white;
  }
  .sub-menu {
    max-height: 300px;
  }

  .light {
    display: block;
  }

  .dark {
    display: none;
  }
}
</style>
