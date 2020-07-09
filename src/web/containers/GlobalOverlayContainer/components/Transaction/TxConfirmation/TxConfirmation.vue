<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="Confirmation" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <FromToBlock
                from="0x300be4b1183dca9046349e9e01b1e0c08e362964"
                to="0x02fb7f333fd493b39b79ba57b6d510c64eaa3dc0"
                class="mb-2"
              />

              <BalanceBlock />

              <mew6-expantion-block title="Details" class="my-8">
                aaaaaa
              </mew6-expantion-block>

              <div class="d-flex justify-center">
                <mew6-std-btn @click.native="activeTab = 1">
                  Continue on your device
                </mew6-std-btn>
              </div>
              <mew6-warning-not-recommended class="mt-8 mb-n4 ml-n4 mr-n4" />
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
import FromToBlock from '@/components/FromToBlock';
import BalanceBlock from '@/components/BalanceBlock';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    OverlayTabs,
    FromToBlock,
    BalanceBlock
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
  width: 600px;
}
</style>
