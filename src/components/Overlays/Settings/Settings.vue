<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />
    <WhiteSheet class="mb-4">
      <div class="overlay-content pa-3">
        <v-expansion-panels flat light>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div class="d-flex align-center">
                <div class="title font-weight-bold mr-3">Gas price</div>
                <div>1 Gwei (Economic)</div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              <div class="text-center">
                <StdButton>Confirm & send</StdButton>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </WhiteSheet>
    <WhiteSheet class="mb-4">
      <div class="overlay-content pa-3">
        <v-expansion-panels flat light>
          <v-expansion-panel>
            <v-expansion-panel-header>Item</v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              <div class="text-center">
                <StdButton>Confirm & send</StdButton>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </WhiteSheet>
    <WhiteSheet>
      <div class="overlay-content pa-3">
        <v-expansion-panels flat light>
          <v-expansion-panel>
            <v-expansion-panel-header>Item</v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              <div class="text-center">
                <StdButton>Confirm & send</StdButton>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </WhiteSheet>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    WhiteSheet,
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
  width: 550px;
}
</style>
