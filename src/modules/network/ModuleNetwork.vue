<template>
  <div class="mew-component--side-info-network">
    <network-switch
      :open="openNetworkOverlay"
      @close="openNetworkOverlay = false"
    />

    <mew6-white-sheet
      :sideinfo="!mobile"
      class="px-5 px-lg-7 py-5 d-flex justify-space-between"
    >
      <div>
        <div class="d-flex align-center">
          <span class="mew-heading-2 mr-2">{{ $t('common.network') }}</span>
          <v-btn
            v-if="show"
            depressed
            color="secondary"
            class="title-button"
            @click.native="openNetworkOverlay = true"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <div class="mt-4">
          <div class="mb-1">{{ type }} - {{ service }}</div>
          <div>Last Block: {{ lastBlock }}</div>
        </div>
      </div>
      <img height="65" :src="network.type.icon" />
    </mew6-white-sheet>
  </div>
</template>

<script>
import NetworkSwitch from './components/NetworkSwitch';
import { mapGetters, mapState } from 'vuex';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '../access-wallet/common/walletTypes';
export default {
  name: 'ModuleNetwork',
  components: { NetworkSwitch },
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openNetworkOverlay: false
    };
  },
  computed: {
    ...mapState('wallet', ['blockNumber', 'identifier']),
    ...mapGetters('global', ['network']),
    type() {
      return this.network.type.name;
    },
    service() {
      return this.network.service;
    },
    lastBlock() {
      return formatIntegerToString(this.blockNumber);
    },
    show() {
      return this.identifier !== WALLET_TYPES.WEB3_WALLET;
    }
  }
};
</script>

<style lang="scss">
.mew-component--side-info-network {
  .title-button {
    height: 28px !important;
    min-width: 28px !important;
    padding: 0 !important;
    border-radius: 5px;
  }
}
</style>
