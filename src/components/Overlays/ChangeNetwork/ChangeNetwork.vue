<template>
  <BaseOverlay :open="open" :close="close" :back="true" close-text="Cancel">
    <div class="overlay-content">
      <OverlayTitle title="Network" />

      <WhiteSheet overflow-hidden>
        <v-btn-toggle
          v-model="activeTab"
          class="d-flex"
          background-color="transparent"
          mandatory
          tile
          borderless
          light
        >
          <v-btn
            :value="0"
            height="60px"
            depressed
            class="flex-grow-1 text-transform--initial white--text"
            color="dark_space"
          >
            Change network
          </v-btn>

          <v-btn
            :value="1"
            height="60px"
            depressed
            class="flex-grow-1 text-transform--initial"
            color="white"
          >
            Add network / HTTP
          </v-btn>
        </v-btn-toggle>
      </WhiteSheet>

      <OverlayTabs class="mt-8">
        <v-tabs v-model="activeTab">
          <v-tab-item>
            <div class="width--100-percent">
              <WhiteSheet>
                <div class="pa-8">
                  1
                  <StdButton size="x-large" fullwidth>
                    Change
                  </StdButton>
                </div>
              </WhiteSheet>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="width--100-percent">
              <WhiteSheet>
                <div class="pa-8">
                  2
                  <StdButton size="x-large" fullwidth>
                    Save
                  </StdButton>
                </div>
              </WhiteSheet>
            </div>
          </v-tab-item>
        </v-tabs>
      </OverlayTabs>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    OverlayTabs,
    WhiteSheet,
    StdButton
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      activeTab: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.v-tabs-bar {
  //display: none;
}

.overlay-content {
  width: 600px;
}
</style>
