<template>
  <div class="mew-component--tools">
    <the-layout-header title="Tools" />

    <div class="expandHeader mobile-menu px-3 mt-n7 d-block d-lg-none">
      <v-select
        v-model="currentTool"
        max-width="500px"
        width="100%"
        class="mx-auto"
        :items="items"
        item-text="name"
        item-value="val"
        outlined
        dark
      ></v-select>
    </div>

    <v-container class="mt-8 mb-12">
      <div class="d-block d-lg-none">
        <module-tools-watch-only v-if="currentTool === 'watch'" />
        <module-tools-convert v-if="currentTool === 'convert'" />
        <module-tools-offline-helper v-if="currentTool === 'offline'" />
        <module-message-verify v-if="currentTool === 'verify'" />
      </div>

      <mew-tabs class="d-none d-lg-block" :is-vertical="true" :items="items">
        <template #tabItemContent1>
          <module-message-verify />
        </template>
        <template #tabItemContent2>
          <module-tools-convert />
        </template>
        <template #tabItemContent3>
          <module-tools-offline-helper />
        </template>
        <template #tabItemContent4>
          <module-tools-watch-only />
        </template>
      </mew-tabs>
    </v-container>
    <app-get-started />
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import AppGetStarted from '@/core/components/AppGetStarted';

import ModuleToolsWatchOnly from '@/modules/tools/ModuleToolsWatchOnly';
import ModuleToolsConvert from '@/modules/tools/ModuleToolsConvert';
import ModuleToolsOfflineHelper from '@/modules/tools/ModuleToolsOfflineHelper';
import ModuleMessageVerify from '@/modules/message/ModuleMessageVerify';
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'MoreActions',
  components: {
    TheLayoutHeader,
    AppGetStarted,
    ModuleToolsWatchOnly,
    ModuleToolsConvert,
    ModuleToolsOfflineHelper,
    ModuleMessageVerify
  },
  data: () => ({
    currentTool: 'watch',
    items: [
      /*
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
      */
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
      this.$router.push({ name: ROUTES_HOME.TOOLS.NAME, query: { tool: val } });
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

<style lang="scss" scoped>
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
