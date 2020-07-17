<template>
  <mew-overlay
    :show-overlay="open"
    title="Settings"
    right-btn-text="Close"
    left-btn-text="Back"
  >
    <template v-slot:mewComponent>
      <v-sheet max-width="750px">
        <mew-expand-panel :panel-items="panelItems">
          <template v-slot:panelBody0>
            <GasPrice />
          </template>
          <template v-slot:panelBody1>
            <ImportConfig />
          </template>
          <template v-slot:panelBody2>
            <ExportConfig />
          </template>
          <template v-slot:panelBody3>
            <Notifications />
          </template>
        </mew-expand-panel>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import ImportConfig from './components/ImportConfig';
import ExportConfig from './components/ExportConfig';
import Notifications from './components/Notifications';
import GasPrice from './components/GasPrice';

export default {
  components: {
    ImportConfig,
    ExportConfig,
    Notifications,
    GasPrice
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
