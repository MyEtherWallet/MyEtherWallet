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
            <div><img width="20" height="20" :src="i.icon" class="mr-3" /></div>
            <div>{{ i.name }}</div>
          </div>
          <div>
            <ul>
              <li v-for="(c, key2) in i.children" :key="key2">
                {{ c.name }}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="i.url">
          <div @click="routerPush(i.url)">{{ i.name }}</div>
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
              url: '/features/dashboard'
            },
            {
              name: 'Send Offline',
              url: '/features/dashboard'
            },
            {
              name: 'NFT Manager',
              url: '/features/dashboard'
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
  mounted() {},
  methods: {
    routerPush(url) {
      this.$router.push({ path: url }, () => {});
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';

ul {
  li {
    div {
      color: white;
    }
  }
}
</style>
