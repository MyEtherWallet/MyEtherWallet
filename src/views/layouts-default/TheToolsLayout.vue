<template>
  <div
    class="mew-component--tools"
    :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'"
  >
    <the-layout-header title="Tools" />

    <div class="px-3 my-12 mx-auto" style="max-width: 800px">
      <mew-tabs :is-vertical="true" :items="items">
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
    </div>
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
      this.$router.push({ name: 'Tools', query: { tool: val } });
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
.mew-component--tools.mobile .v-item-group.v-slide-group {
  display: none !important;
}
</style>
