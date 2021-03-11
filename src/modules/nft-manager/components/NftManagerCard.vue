<template>
  <v-card
    flat
    color="superPrimary"
    class="rounded-lg pa-2 d-flex align-center justify-space-between"
  >
    <div class="d-flex align-center">
      <img
        height="100"
        :src="token.image ? token.image : getImageUrl(token)"
        alt="nft token"
      />
      <div class="ml-2">{{ token.name }}</div>
    </div>
    <mew-button
      class="mr-5"
      :has-full-width="false"
      btn-style="outline"
      title="Send"
      btn-size="large"
      @click.native="send(token)"
    />
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
    send: {
      default: () => {
        return;
      },
      type: Function
    }
  }
};
</script>
