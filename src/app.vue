<template>
  <v-app>
    <v-main>
      <v-sheet>
        <router-view />
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  mounted() {
    this.setOnlineStatus(window.navigator.onLine);
    // Window events to watch out if the online status changes
    window.addEventListener('offline', () => {
      this.setOnlineStatus(false);
    });
    window.addEventListener('online', () => {
      this.setOnlineStatus(true);
    });
  },
  methods: {
    ...mapActions('global', ['setOnlineStatus'])
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/GlobalStyles.scss';
@import '@myetherwallet/mew-components/src/assets/styles/global.scss';
</style>
