<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <h2 class="text-center mb-8">Notifications</h2>
      <WhiteSheet>
        <div class="pa-8">
          <div>
            <div class="text-center font-weight-bold">1/8/2020</div>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>Item</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Item</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>Item</v-expansion-panel-header>
                <v-expansion-panel-content>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </WhiteSheet>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import WhiteSheet from '@/web/components/Common/WhiteSheet';

export default {
  components: {
    BaseOverlay,
    WhiteSheet
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
.overlay-content {
  width: 700px;
}
</style>
