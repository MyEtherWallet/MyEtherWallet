<template>
  <div
    class="mew-component--tools"
    :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'"
  >
    <the-layout-header title="Tools" />

    <v-container class="px-3 my-12">
      <mew-tabs
        :is-vertical="$vuetify.breakpoint.smAndDown ? false : true"
        :items="items"
        :active-tab="activeTab"
        show-arrows
        @onTab="tabChanged"
      >
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
  name: 'TheToolsLayout',
  components: {
    TheLayoutHeader,
    AppGetStarted,
    ModuleToolsWatchOnly,
    ModuleToolsConvert,
    ModuleToolsOfflineHelper,
    ModuleMessageVerify
  },
  data: () => ({
    currentTool: '',
    activeTab: 0,
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
      },
      {
        name: 'Convert Units',
        val: 'convert'
      }
    ]
  }),
  watch: {
    $route() {
      this.setCurrentTool();
    },
    currentTool(val) {
      this.$router.push({ name: ROUTES_HOME.TOOLS.NAME, query: { tool: val } });
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

        switch (this.currentTool) {
          case 'verify':
            this.activeTab = 0;
            this.currentTool = 'verify';
            break;

          case 'convert':
            this.activeTab = 1;
            this.currentTool = 'convert';
            break;

          default:
            this.activeTab = 0;
            this.currentTool = 'verify';
        }
      } else {
        this.activeTab = 0;
        this.currentTool = 'verify';
      }
    },
    tabChanged(tab) {
      this.activeTab = tab;

      switch (tab) {
        case 0:
          this.currentTool = 'verify';
          break;

        case 1:
          this.currentTool = 'convert';
          break;

        default:
          this.currentTool = 'verify';
      }
    }
  }
};
</script>

<style lang="scss">
.mew-component--tools.desktop .v-item-group.v-slide-group {
  padding-right: 40px;
  margin-right: 40px;
  border-right: 1px solid var(--v-selectBorder-base) !important;
}
</style>
