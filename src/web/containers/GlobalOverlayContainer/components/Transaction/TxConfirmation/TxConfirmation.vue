<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="Mobile Apps" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              aaaa
              <mew6-std-btn min-width="100%" @click.native="activeTab = 1">
                to 1
              </mew6-std-btn>
            </div>
          </mew6-white-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="2. Confirm network & address" />
          <div class="overlay-content">
            bbbbb
            <mew6-std-btn min-width="100%" @click.native="activeTab = 0">
              to 0
            </mew6-std-btn>
          </div>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    OverlayTabs
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
.overlay-content {
  width: 500px;
}
</style>
