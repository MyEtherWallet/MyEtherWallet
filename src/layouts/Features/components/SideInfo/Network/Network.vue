<template>
  <WhiteSheet sideinfo class="px-7 py-5 d-flex justify-space-between">
    <NetworkOverlay :open="openNetworkOverlay" :close="closeNetworkOverlay" />

    <div>
      <BlockTitle :text="$t('common.network')">
        <template v-slot:object-next-to-title>
          <SoloButton @click.native="openNetworkOverlay = true">
            <v-icon>mdi-chevron-right</v-icon>
          </SoloButton>
        </template>
      </BlockTitle>
      <div class="mt-3">
        <!-- placeholders -->
        <div class="mb-1">ETH - myetherwallet.com</div>
        <div>Last Block: #5699679</div>
      </div>
    </div>
    <img
      width="60"
      height="60"
      src="@/assets/images/currencies//eth.png"
      alt="ethereum"
    />
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import BlockTitle from '@/components/BlockTitles/BlockTitle2';
import SoloButton from '@/components/Buttons/SoloButton1';
import NetworkOverlay from '@/components/Overlays/Network';

export default {
  components: { WhiteSheet, BlockTitle, SoloButton, NetworkOverlay },
  data() {
    return {
      openNetworkOverlay: false
    };
  },
  methods: {
    closeNetworkOverlay() {
      this.openNetworkOverlay = false;
    }
  }
};
</script>
