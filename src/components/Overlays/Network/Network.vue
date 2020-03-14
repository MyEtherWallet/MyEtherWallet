<template>
  <BaseOverlay :open="open" :close="close" close-text="Cancel">
    <OverlayTabs>
      <v-tabs v-model="activeTab">
        <v-tab :key="1" />
        <v-tab :key="2" />

        <v-tab-item>
          <h2 class="text-center mb-6">1. Connect with Ledger</h2>
          <WhiteSheet>
            <div class="pa-8">
              <InputSearch
                v-model="appSelected"
                :items="apps"
                title="Choose your coin"
                placeholder="Search..."
              />
              <InputSearch
                v-model="pathSelected"
                :items="path"
                title="HD derivation path"
                placeholder="Search..."
              />

              <div class="text-center">
                <StdButton @click.native="activeTab = 1">
                  Connect with Ledger
                </StdButton>
              </div>
            </div>
          </WhiteSheet>
        </v-tab-item>
        <v-tab-item>
          <h2 class="text-center mb-6">2. Connect with Ledger</h2>
          <WhiteSheet>
            <div class="pa-8">
              <div class="text-center">
                <StdButton @click.native="activeTab = 0">
                  Confirm & send
                </StdButton>
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
import InputSearch from '@/components/Inputs/InputSearch1';

export default {
  components: {
    BaseOverlay,
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
</style>
