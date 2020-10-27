<template>
  <div class="mew-component--side-info-network">
    <changeNetworkOverlay
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
            depressed
            color="secondary"
            class="title-button"
            @click.native="openNetworkOverlay = true"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
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
