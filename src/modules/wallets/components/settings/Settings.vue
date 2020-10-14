<template>
  <mew-overlay
    :show-overlay="open"
    title="Settings"
    right-btn-text="Close"
    left-btn-text="Back"
  >
    <template #mewOverlayBody>
      <mew-expand-panel :panel-items="panelItems">
        <template #panelBody1>
          <gas-price />
        </template>
        <template #panelBody2>
          <import-config />
        </template>
        <template #panelBody3>
          <export-config />
        </template>
        <template #panelBody4>
          <notifications />
        </template>
      </mew-expand-panel>
    </template>
  </mew-overlay>
</template>

<script>
import importConfig from './components/import-config/ImportConfig';
import exportConfig from './components/export-config/ExportConfig';
import notifications from './components/notifications/Notifications';
import gasPrice from './components/gas-price/GasPrice';

export default {
  components: {
    importConfig,
    exportConfig,
    notifications,
    gasPrice
  },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      panelItems: [
        {
          name: 'Gas price',
          subtext: '1 Gwei (Economic)'
        },
        {
          name: 'Import configurations'
        },
        {
          name: 'Export configurations'
        },
        {
          name: 'Notifications'
        }
      ]
    };
  }
};
</script>
