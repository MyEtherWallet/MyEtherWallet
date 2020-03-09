<template>
  <div class="accordion-menu-container user-select--none">
    <v-list color="transparent">
      <div v-for="(i, key1) in menuItems" :key="key1">
        <v-list-item v-if="i.url">
          <v-list-item-title dark class="d-flex align-center">
            <img width="23" height="23" :src="i.iconLight" class="mr-3" />
            <div>{{ i.name }}</div>
          </v-list-item-title>
        </v-list-item>

        <v-list-group v-else>
          <template v-slot:activator>
            <v-list-item-title class="d-flex align-center">
              <img width="23" height="23" :src="i.iconLight" class="mr-3" />
              <div>{{ i.name }}</div>
            </v-list-item-title>
          </template>

          <v-list-item-content
            v-for="(c, key2) in i.children"
            :key="key2"
            class="py-2"
          >
            <div class="menu-sub-item">{{ c.name }}</div>
          </v-list-item-content>
        </v-list-group>
      </div>
    </v-list>
  </div>
</template>

<script>
import SwapDark from '@/assets/images/icons/icon-swap-dark.svg';
import SwapLight from '@/assets/images/icons/icon-swap-light.svg';

export default {
  components: {},
  data() {
    return {
      currentURL: '',
      menuItems: [
        {
          name: 'Dashboard',
          iconDark: SwapDark,
          iconLight: SwapLight,
          url: '/wallet/dashboard'
        },
        {
          name: 'Send',
          iconDark: SwapDark,
          iconLight: SwapLight,
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
          iconDark: SwapDark,
          iconLight: SwapLight,
          url: '/wallet/dapps'
        },
        {
          name: 'Contract',
          iconDark: SwapDark,
          iconLight: SwapLight,
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
          iconDark: SwapDark,
          iconLight: SwapLight,
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
//@import '@/assets/styles/GlobalVariables.scss';
* {
  color: white;
}

.menu-sub-item {
  padding-left: 51px;
}
</style>

<style lang="scss">
.accordion-menu-container .v-icon {
  color: rgb(77, 104, 126);
}

.accordion-menu-container .v-list .v-list-item--active .v-icon {
  color: white;
}
</style>
