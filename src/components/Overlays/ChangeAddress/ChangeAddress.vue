<template>
  <BaseOverlay :open="open" :close="close" :back="true" close-text="Cancel">
    <OverlayTabs class="overlay-content">
      <v-tabs v-model="activeTab">
        <v-tab :key="1" />
        <v-tab :key="2" />

        <v-tab-item>
          <div class="width--100-percent">
            <OverlayTitle title="1. Connect with Ledger" />

            <WhiteSheet>
              <div class="pa-8">
                <div class="mt-2 mb-9 text-center">
                  <img
                    width="70"
                    height="70"
                    src="@/assets/images/currencies/icon-eth-blue.svg"
                  />
                </div>
                <InputSearch
                  v-model="appSelected"
                  :items="apps"
                  title="Choose your coin"
                  placeholder="Search..."
                  class="mb-1"
                />
                <InputSearch
                  v-model="pathSelected"
                  :items="path"
                  title="HD derivation path"
                  placeholder="Search..."
                  class="mb-1"
                />

                <div class="text-center">
                  <StdButton
                    size="x-large"
                    fullwidth
                    @click.native="activeTab = 1"
                  >
                    Connect with Ledger
                  </StdButton>
                </div>
              </div>
            </WhiteSheet>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="width--100-percent">
            <OverlayTitle title="2. Confirm network & address" />
            <WhiteSheet>
              <AddressSelection />
              <div class="pa-8">
                <div class="text-center">
                  <StdButton
                    size="x-large"
                    fullwidth
                    @click.native="activeTab = 0"
                  >
                    Access My Wallet
                  </StdButton>
                </div>
              </div>
            </WhiteSheet>
          </div>
        </v-tab-item>
      </v-tabs>
    </OverlayTabs>
  </BaseOverlay>
</template>

<script>
import AddressSelection from './components/AddressSelection';
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import OverlayTabs from '@/components/OverlayTabs';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import StdButton from '@/web/components/StdButton';
import InputSearch from '@/components/Inputs/InputSearch1';

export default {
  components: {
    AddressSelection,
    BaseOverlay,
    OverlayTitle,
    OverlayTabs,
    WhiteSheet,
    StdButton,
    InputSearch
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
      tabs: { id: 0, title: '' },
      appSelected: '',
      apps: [
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum2', value: 'eth2' },
        { name: 'Ethereum3', value: 'eth3' }
      ],
      pathSelected: '',
      path: [
        { name: "m/44'/60'/0'", value: '1' },
        { name: "m/44'/60'/2'", value: '2' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.v-tabs-bar {
  display: none;
}

.overlay-content {
  width: 500px;
}
</style>
