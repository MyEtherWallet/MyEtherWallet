<template>
  <div class="d-flex justify-center flex-wrap no-nft">
    <img :src="spaceman" width="180" height="180" />
    <h1 class="heading mb-3 mt-5">You have no NFT's</h1>
    <p>
      NFT’s, or Non-Fungible Tokens are digital assets that contain digital art,
      realstate, or video.
    </p>
    <p class="link">Learn more</p>
    <div class="d-flex justify-space-around mt-5 button-container">
      <mew-button
        title="Browse NFT's"
        color-theme="secondary"
        class="button secondary"
        background-color="red"
      />
      <mew-button title="Mint an ETH Block" class="button" />
    </div>
  </div>
</template>

<script>
import spaceman from '@/assets/images/backgrounds/reading-spaceman.png';
export default {
  data() {
    return {
      spaceman
    };
  }
};
</script>

<style lang="scss" scoped>
.no-nft {
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}
.link {
  text-decoration: underline;
  color: #4b83e8;
}
.button-container {
  width: 100%;
}
.button {
  width: 176px;
}
</style>
