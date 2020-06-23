<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab" color="transparent">
        <v-tab-item>
          <OverlayTitle title="1. Connect with Ledger" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <div class="text-center mb-8">
                <img
                  src="@/assets/images/currencies/icon-eth-blue.svg"
                  alt="Eth icon"
                  height="60"
                />
              </div>
              <div>
                <v-select
                  v-model="appSelect"
                  :items="apps"
                  item-text="label"
                  item-value="abbr"
                  label="App opened in Ledger"
                  outlined
                ></v-select>
                <v-select
                  v-model="derivationPathSelect"
                  :items="derivationPath"
                  item-text="label"
                  item-value="abbr"
                  label="HD derivation path"
                  outlined
                ></v-select>
              </div>
              <mew6-std-btn min-width="100%" @click.native="activeTab = 1">
                Connect with Ledger
              </mew6-std-btn>
            </div>
          </mew6-white-sheet>
        </v-tab-item>
        <v-tab-item>
          <OverlayTitle title="2. Confirm network & address" />
          <mew6-white-sheet>
            <div class="overlay-content pa-8">
              <div>aaaaa</div>
              <mew6-std-btn @click.native="activeTab = 0">
                Connect with Ledger
              </mew6-std-btn>
            </div>
          </mew6-white-sheet>
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
      appSelect: 'eth',
      derivationPathSelect: '1',
      activeTab: 0,
      apps: [
        { label: 'Ethereum', abbr: 'eth' },
        { label: 'SometingElse', abbr: 'smt' }
      ],
      derivationPath: [
        { label: `m/44'/60'/0'`, abbr: '1' },
        { label: `m/44'/60'/0'`, abbr: '2' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.overlay-content {
  width: 450px;
}
</style>
