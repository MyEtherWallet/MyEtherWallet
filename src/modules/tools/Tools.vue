<template>
  <div class="mew-component--tools">
    <home-header title="Tools" />

    <div class="expandHeader mobile-menu px-3 mt-n7 d-block d-lg-none">
      <v-sheet
        max-width="500px"
        width="100%"
        class="mx-auto"
        color="expandHeader"
      >
        <v-select
          v-model="currentTool"
          :items="items"
          item-text="name"
          item-value="val"
          outlined
        ></v-select>
      </v-sheet>
    </div>

    <v-container class="mt-8 mb-12">
      <div class="d-block d-lg-none">
        <watch-only v-if="currentTool === 'watch'" />
        <convert v-if="currentTool === 'convert'" />
        <offline-helper v-if="currentTool === 'offline'" />
        <verify v-if="currentTool === 'verify'" />
      </div>

      <mew-tabs class="d-none d-lg-block" :is-vertical="true" :items="items">
        <template #tabItemContent1>
          <watch-only />
        </template>
        <template #tabItemContent2>
          <convert />
        </template>
        <template #tabItemContent3>
          <offline-helper />
        </template>
        <template #tabItemContent4>
          <verify />
        </template>
      </mew-tabs>
    </v-container>
    <get-started />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header/HomeHeader';
import getStarted from '@/components/get-started/GetStarted';
import watchOnly from './pages/watch-only/WatchOnly';
import convert from './pages/convert/Convert';
import offlineHelper from './pages/offline-helper/OfflineHelper';
import verify from './pages/verify/Verify';

export default {
  name: 'MoreActions',
  components: {
    homeHeader,
    getStarted,
    watchOnly,
    convert,
    offlineHelper,
    verify
  },
  data: () => ({
    currentTool: 'watch',
    items: [
      {
        name: 'Watch only address',
        val: 'watch'
      },
      {
        name: 'Convert units',
        val: 'convert'
      },
      {
        name: 'Send offline helper',
        val: 'offline'
      },
      {
        name: 'Verify message',
        val: 'verify'
      }
    ]
  }),
  watch: {
    $route() {
      this.setCurrentTool();
    },
    currentTool(val) {
      this.$router.push({ name: 'Tools', query: { tool: val } });
      //this.setCurrentTool();
    }
  },
  mounted() {
    this.setCurrentTool();
  },
  methods: {
    setCurrentTool() {
      const tools = ['watch', 'convert', 'offline', 'verify'];

      // Check if tool value from URL is valid
      if (tools.includes(this.$route.query.tool)) {
        this.currentTool = this.$route.query.tool;
      } else {
        this.currentTool = 'watch';
      }
    }
  }
};
</script>

<style lang="scss">
.mew-component--tools {
  .mobile-menu {
    .v-input__slot {
      margin: 0;
    }
    .v-select__selection {
      font-size: 1.2rem;
      font-weight: 600;
    }
    .v-select__selection,
    .v-icon {
      color: white !important;
    }
  }

  .v-tabs {
    .v-slide-group {
      border-right: 1px solid var(--v-inputBorder-base) !important;
      margin-right: 50px;
      padding-right: 30px;
    }
    .v-tab {
      text-align: left;
      font-weight: 400 !important;
      font-size: 14px !important;
      justify-content: flex-start;
    }
    .v-tab--active {
      font-weight: 600 !important;
      border-left: 4px solid var(--v-primary-base) !important;
    }
  }
}
</style>
