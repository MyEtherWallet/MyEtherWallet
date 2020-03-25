<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <div class="overlay-content">
      <h2 class="text-center mb-8">Notifications</h2>
      <WhiteSheet>
        <div class="pa-8">
          <div>
            <div class="text-center font-weight-bold">1/8/2020</div>
            <v-expansion-panels light hover flat>
              <v-expansion-panel>
                <v-expansion-panel-header color="red">
                  <div class="d-flex align-center">
                    <div class="mr-6">icon</div>
                    <div>
                      <div>From: 0x92349857934875</div>
                      <div>Abount: 0.0000123 ETH</div>
                    </div>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content color="red">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header color="blue"
                  >Item</v-expansion-panel-header
                >
                <v-expansion-panel-content color="blue">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header color="#f2fafa"
                  >Item</v-expansion-panel-header
                >
                <v-expansion-panel-content color="#f2fafa">
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
.v-expansion-panel-content {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.overlay-content {
  width: 700px;
}
</style>
