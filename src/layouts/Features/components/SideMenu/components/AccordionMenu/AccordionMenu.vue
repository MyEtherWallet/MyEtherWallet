<template>
  <div>
    <ul style="padding-left: 0;">
      <li
        v-for="(i, k) in menuItems"
        :key="k"
        class="user-select--none cursor--pointer list-style-type--none py-2"
      >
        <div class="d-flex align-center">
          <img width="20" height="20" :src="i.icon" class="mr-3" />
          <div>{{ i.name }}</div>
          <div v-if="i.url">
            <div @click="routerPush(i.url)">{{ i.name }}</div>
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
      menuItems: [
        {
          name: 'Dashboard',
          icon: IconDashboard,
          url: '/features/dashboard'
        },
        {
          name: 'Swap',
          icon: IconDashboard,
          url: '/features/swap'
        }
      ]
    };
  },
  methouds: {
    routerPush(url) {
      this.$router.push({ path: url });
    }
  },
  mounted() {}
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
