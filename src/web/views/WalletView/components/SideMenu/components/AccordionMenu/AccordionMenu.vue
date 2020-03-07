<template>
  <div>
    <ul style="padding-left: 0;">
      <li
        v-for="(i, key1) in menuItems"
        :key="key1"
        class="user-select--none cursor--pointer list-style-type--none"
      >
        <div v-if="!i.url">
          <div class="d-flex align-center py-3">
            <img width="20" height="20" :src="i.iconLight" class="mr-3" />
            <div :class="currentURL == i.url ? 'active' : ''">{{ i.name }}</div>
          </div>
          <div>
            <ul>
              <li v-for="(c, key2) in i.children" :key="key2">
                <div
                  :class="currentURL == c.url ? 'active' : ''"
                  class="py-3 pl-3"
                  @click="routerPush(c.url)"
                >
                  {{ c.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="i.url">
          <div class="d-flex align-center py-3" @click="routerPush(i.url)">
            <img width="20" height="20" :src="i.iconLight" class="mr-3" />
            <div :class="currentURL == i.url ? 'active' : ''">{{ i.name }}</div>
          </div>
        </div>
      </li>
    </ul>
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
@import '@/assets/styles/GlobalVariables.scss';

.active {
  color: white;
}

ul {
  li {
    div {
      color: $independence;
    }
  }
}
</style>
