<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab">
        <v-tab :key="1" />
        <v-tab :key="2" />

        <v-tab-item>
          <h2 class="text-center mb-6">1. Connect with Ledger</h2>
          <WhiteSheet>
            <div class="overlay-content">
              <div class="pa-8">
                <div class="text-center">
                  <StdButton @click.native="activeTab = 1">
                    Confirm & send
                  </StdButton>
                </div>
              </div>
            </div>
          </WhiteSheet>
        </v-tab-item>
        <v-tab-item>
          <h2 class="text-center mb-6">2. Connect with Ledger</h2>
          <WhiteSheet>
            <div class="overlay-content">
              <div class="pa-8">
                <div class="text-center">
                  <StdButton @click.native="activeTab = 0">
                    Confirm & send
                  </StdButton>
                </div>
              </div>
            </div>
          </WhiteSheet>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTabs from '@/components/OverlayTabs';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';

export default {
  components: {
    BaseOverlay,
    OverlayTabs,
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
    return {
      activeTab: 0,
      tabs: { id: 0, title: '' }
    };
  }
};
</script>

<style lang="scss" scoped>
.v-tabs-bar {
  display: none;
}

.overlay-content {
  max-width: 550px;
}
</style>
