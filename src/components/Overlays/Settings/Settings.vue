<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />

    <div class="overlay-content">
      <v-expansion-panels flat light>
        <ExpansionPanelContent title="Gas price" subtitle="1 Gwei (Economic)">
          <template v-slot:content>
            <GasPrice />
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Import configurations">
          <template v-slot:content>
            <ImportConfig />
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Export configurations">
          <template v-slot:content>
            <ExportConfig />
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Contact addresses">
          <template v-slot:content>
            <Addresses />
          </template>
        </ExpansionPanelContent>
      </v-expansion-panels>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import ExpansionPanelContent from './components/ExpansionPanelContent';
import ImportConfig from './components/ImportConfig';
import ExportConfig from './components/ExportConfig';
import Addresses from './components/Addresses';
import GasPrice from './components/GasPrice';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    ExpansionPanelContent,
    ImportConfig,
    ExportConfig,
    Addresses,
    GasPrice
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function() {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.overlay-content {
  width: 750px;
}

.v-expansion-panel {
  margin-top: 20px !important;
  border-radius: 12px !important;
  box-shadow: $gray-3 0px 0px 15px;

  &:first-child {
    margin-top: 0px !important;
  }
}
</style>
