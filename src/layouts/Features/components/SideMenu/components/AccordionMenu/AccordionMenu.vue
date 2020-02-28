<template>
  <div>
    <ul style="padding-left: 0;">
      <li
        v-for="(i, key1) in menuItems"
        :key="key1"
        class="user-select--none cursor--pointer list-style-type--none py-2"
      >
        <div v-if="!i.url">
          <div class="d-flex align-center">
            <img width="20" height="20" :src="i.icon" class="mr-3" />
            <div>{{ i.name }}</div>
          </div>
          <div>
            <ul>
              <li v-for="(c, key2) in i.children" :key="key2">
                <div @click="routerPush(c.url)">{{ c.name }}</div>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="i.url">
          <div class="d-flex align-center" @click="routerPush(i.url)">
            <img width="20" height="20" :src="i.icon" class="mr-3" />
            <div :class="currentURL == i.url ? 'active' : ''">{{ i.name }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import IconDashboard from '@/assets/images/Icons/btc.png';

export default {
  components: {},
  data() {
    return {
      currentURL: '',
      menuItems: [
        {
          name: 'Dashboard',
          icon: IconDashboard,
          url: '/features/dashboard'
        },
        {
          name: 'Send',
          icon: IconDashboard,
          children: [
            {
              name: 'Send Transaction',
              url: '/features/send/sendtx'
            },
            {
              name: 'Send Offline',
              url: '/features/send/send-offline'
            },
            {
              name: 'NFT Manager',
              url: '/features/send/nft-manager'
            }
          ]
        },
        {
          name: 'Swap',
          icon: IconDashboard,
          url: '/features/swap'
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
