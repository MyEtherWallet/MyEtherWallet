<template>
  <div
    class="mew-component--tools"
    :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'"
  >
    <the-layout-header title="Tools" class="pt-16" />

    <v-container class="px-3 my-12">
      <mew-tabs
        :is-vertical="$vuetify.breakpoint.smAndDown ? false : true"
        :compact="$vuetify.breakpoint.smAndDown"
        :items="items"
        :active-tab="activeTab"
        show-arrows
        @onTab="tabChanged"
      >
        <template #tabItemContent1>
          <module-message-verify ref="verifyMessageModule" />
        </template>
        <template #tabItemContent2>
          <module-tools-convert />
        </template>
        <template #tabItemContent3>
          <module-tools-offline-helper :is-home-page="true" />
        </template>
      </mew-tabs>
    </v-container>
    <get-started />
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'TheToolsLayout',
  components: {
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader'),
    ModuleToolsConvert: () => import('@/modules/tools/ModuleToolsConvert'),
    ModuleToolsOfflineHelper: () =>
      import('@/modules/tools/ModuleToolsOfflineHelper'),
    ModuleMessageVerify: () => import('@/modules/message/ModuleMessageVerify'),
    GetStarted: () => import('../components-default/GetStarted')
  },
  data: () => ({
    currentTool: '',
    activeTab: 0,
    items: [
      {
        name: 'Verify Message',
        val: 'verify'
      },
      {
        name: 'Convert Units',
        val: 'convert'
      },
      {
        name: 'Send Offline Helper',
        val: 'offline'
      }
    ]
  }),
  watch: {
    $route() {
      this.setCurrentTool();
    },
    currentTool(val) {
      this.$refs.verifyMessageModule?.clearAll();
      this.$router.push({ name: ROUTES_HOME.TOOLS.NAME, query: { tool: val } });
    }
  },
  mounted() {
    this.setCurrentTool();
  },
  methods: {
    setCurrentTool() {
      const tools = ['convert', 'offline', 'verify'];

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
          case 'offline':
            this.activeTab = 2;
            this.currentTool = 'offline';
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
        case 2:
          this.currentTool = 'offline';
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
  border-right: 1px solid var(--v-greyLight-base) !important;
}
</style>
