<template>
  <!--
    =====================================================================================
      Nft Manager Details Component
    =====================================================================================
    -->
  <v-card flat color="tableHeader" class="rounded-lg pa-2 d-flex align-center">
    <img
      height="100"
      :src="token.image ? token.image : getImageUrl(token)"
      alt="nft token"
    />
    <div
      class="
        d-flex
        align-center
        flex-column flex-md-row flex-lg-row flex-xl-row
        justify-space-between
        pa-3
        full-width
      "
    >
      <span :class="$vuetify.breakpoint.smAndDown ? 'mb-1' : ''">{{
        token.name
      }}</span>
      <mew-button
        :has-full-width="false"
        btn-style="outline"
        title="Send"
        btn-size="large"
        @click.native="onClick(token)"
      />
    </div>
  </v-card>
</template>
<script>
export default {
  props: {
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
  }
};
</script>
