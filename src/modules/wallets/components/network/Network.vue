<template>
  <div class="mew-component--side-info-network">
    <changeNetworkOverlay
      :open="openNetworkOverlay"
      @close="openNetworkOverlay = false"
    />

    <mew6-white-sheet full-width class="px-7 py-5 d-flex justify-space-between">
      <div>
        <div class="d-flex align-center">
          <span class="mew-heading-2 mr-2">{{ $t('common.network') }}</span>
          <mew-button
            class="title-button"
            button-size="small"
            color-theme="secondary"
            icon-type="mdi"
            icon="mdi-chevron-right"
            @click.native="openNetworkOverlay = true"
          />
        </div>

        <div class="mt-4">
          <!-- placeholders -->
          <div class="mb-1">ETH - myetherwallet.com</div>
          <div>Last Block: #5699679</div>
        </div>
      </div>
      <mew-icon icon-name="ETH" :img-height="65" />
    </mew6-white-sheet>
  </div>
</template>

<script>
import changeNetworkOverlay from '../change-network/ChangeNetwork';

export default {
  components: { changeNetworkOverlay },
  data() {
    return {
      openNetworkOverlay: false
    };
  }
};
</script>

<style lang="scss">
.mew-component--side-info-network {
  .title-button {
    padding: 0 !important;
    min-width: 28px !important;
    height: 28px !important;
    text-align: center;
    i {
      margin-right: 0 !important;
    }
  }
}
</style>
