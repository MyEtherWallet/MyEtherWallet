<template>
  <mew6-white-sheet sideinfo class="px-7 py-5 d-flex justify-space-between">
    <changeNetworkOverlay
      :open="openNetworkOverlay"
      :close="closeNetworkOverlay"
    />
    <div>
      <div class="d-flex align-center">
        <span class="mew-heading-2 mr-2">{{ $t('common.network') }}</span>
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
import changeNetworkOverlay from '../change-network/ChangeNetwork';

export default {
  components: { changeNetworkOverlay },
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
