<template>
  <div class="mew-component--side-info-network">
    <changeNetworkOverlay
      :open="openNetworkOverlay"
      :close="closeNetworkOverlay"
    />

    <mew6-white-sheet sideinfo class="px-7 py-5 d-flex justify-space-between">
      <div>
        <div class="d-flex align-center">
          <span class="mew-heading-2 mr-2">{{ $t('common.network') }}</span>
          <mew-button
            class="title-button"
            btn-size="small"
            color-theme="secondary"
            icon-type="mdi"
            icon="mdi-chevron-right"
            @click.native="openNetworkOverlay = true"
          />
        </div>

        <div class="mt-4">
          <!-- placeholders -->
          <div class="mb-1">{{ type }} - {{ service }}</div>
          <div>Last Block: {{ blockNumber }}</div>
        </div>
      </div>
      <mew-icon :icon-name="type" :img-height="65" />
    </mew6-white-sheet>
  </div>
</template>

<script>
import changeNetworkOverlay from './change-network/ChangeNetwork';
import { mapState } from 'vuex';
export default {
  components: { changeNetworkOverlay },
  data() {
    return {
      openNetworkOverlay: false
    };
  },
  computed: {
    ...mapState('wallet', ['blockNumber', 'network']),
    type() {
      return this.network.type.name;
    },
    service() {
      return this.network.service;
    }
  },
  methods: {
    closeNetworkOverlay() {
      this.openNetworkOverlay = false;
    }
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
