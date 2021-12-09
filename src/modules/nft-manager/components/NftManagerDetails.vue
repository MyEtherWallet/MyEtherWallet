<template>
  <!--
  =====================================================================================
    Nft Manager Details Component
  =====================================================================================
  -->
  <v-card flat color="greyLight" class="rounded-lg pa-2 d-flex align-center">
    <!--
  =====================================================================================
    Loading Details
  =====================================================================================
  -->
    <v-skeleton-loader
      v-if="loading"
      class="nft-manager-details-loader greyLight py-2"
      width="100%"
      height="100%"
      type="list-item-avatar"
    />
    <!--
  =====================================================================================
    Loaded Details
  =====================================================================================
  -->
    <div v-if="!loading" class="d-flex align-center full-width">
      <img
        height="100"
        :src="token.image ? token.image : getImageUrl(token)"
        alt="nft token"
        @error="onImgErr"
      />
      <div
        class="d-flex align-center flex-column flex-md-row flex-lg-row flex-xl-row justify-space-between pa-3 full-width"
      >
        <span :class="$vuetify.breakpoint.smAndDown ? 'mb-1' : ''"
          >#{{ token.name }}</span
        >
        <mew-button
          :has-full-width="false"
          btn-style="outline"
          title="Send"
          btn-size="large"
          @click.native="onClick(token)"
        />
      </div>
    </div>
  </v-card>
</template>
<script>
import nftPlaceholder from '@/assets/images/icons/icon-nft-placeholder.png';

export default {
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    token: {
      default: () => {
        return {};
      },
      type: Object
    },
    getImageUrl: {
      default: () => {
        return;
      },
      type: Function
    },
    onClick: {
      default: () => {
        return;
      },
      type: Function
    }
  },
  data() {
    return {
      nftPlaceholder: nftPlaceholder
    };
  },
  methods: {
    onImgErr(e) {
      e.target.src = this.nftPlaceholder;
    }
  }
};
</script>
<style lang="scss">
.nft-manager-details-loader {
  .v-skeleton-loader__list-item-avatar {
    background: none !important;
  }
}
</style>
