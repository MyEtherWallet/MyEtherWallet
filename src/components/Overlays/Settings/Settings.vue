<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />

    <div class="overlay-content">
      <v-expansion-panels flat light>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex align-center">
              <PanelHeader title="Gas price" subtitle="1 Gwei (Economic)" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <div class="text-center">
              <StdButton>Confirm & send</StdButton>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex align-center">
              <PanelHeader title="Import configurations" />
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <div class="text-center">
              <StdButton>Confirm & send</StdButton>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <PanelHeader title="Export configurations" />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <div class="text-center">
              <StdButton>Confirm & send</StdButton>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <PanelHeader title="Contact address" />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <div class="text-center">
              <StdButton>Confirm & send</StdButton>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import PanelHeader from './components/PanelHeader';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    PanelHeader,
    StdButton
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
  width: 650px;
}

.v-expansion-panel {
  margin-top: 20px !important;
  border-radius: 12px !important;
  box-shadow: $gray-3 0px 0px 15px;
  padding: 12px 15px;

  &:first-child {
    margin-top: 0px !important;
  }
}
</style>
