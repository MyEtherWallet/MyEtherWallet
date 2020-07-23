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

              <mew-expand-panel>
                <template v-slot:panelBody0 :panel-items="panelItems">
                  <div class="px-3">
                    <div class="d-flex justify-space-between mb-2">
                      <div>Network</div>
                      <div>ETH by myetherwallet.com</div>
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <div>Gas Price</div>
                      <div>40 <span class="emerald--text">GWEI</span></div>
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <div>Gas Limit</div>
                      <div>21000 <span class="emerald--text">WEI</span></div>
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <div>Nonce</div>
                      <div>17</div>
                    </div>
                    <div class="d-flex justify-space-between">
                      <div>Data</div>
                      <div>0x</div>
                    </div>
                  </div>
                </template>
              </mew-expand-panel>

              <div class="d-flex justify-center">
                <mew-button
                  button-size="xlarge"
                  title="Continue on your device"
                  @click.native="activeTab = 1"
                />
              </div>

              <warning-sheet
                title="NOT RECOMMENDED"
                description="Not recommanded"
              />
            </div>
          </mew6-white-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="2. Confirm network & address" />
          <div class="overlay-content">
            bbbbb
            <mew-button
              button-size="xlarge"
              title="  to 0"
              @click.native="activeTab = 0"
            />
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
      panelItems: [
        {
          name: 'Network',
          subtext: 'ETH - myetherapi.com'
        }
      ],
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
