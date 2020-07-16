<template>
  <mew6-white-sheet sideinfo class="px-7 py-5 d-flex justify-space-between">
    <ChangeNetworkOverlay
      :open="openNetworkOverlay"
      :close="closeNetworkOverlay"
    />
    <div>
      <div class="d-flex align-center">
        <mew-module :title="$t('common.network')" />
        <mew-button
          button-size="small"
          color-theme="secondary"
          icon-type="mdi"
          icon="mdi-chevron-right"
          @click.native="openNetworkOverlay = true"
        />
      </div>

      <div class="mt-3">
        <!-- placeholders -->
        <div class="mb-1">ETH - myetherwallet.com</div>
        <div>Last Block: #5699679</div>
      </div>
    </div>
    <mew-icon icon-name="ETH" :img-height="65" />
  </mew6-white-sheet>
</template>

<script>
import ChangeNetworkOverlay from '@/components/Overlays/ChangeNetwork';

export default {
  components: { ChangeNetworkOverlay },
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
