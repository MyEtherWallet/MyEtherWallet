<template>
  <div class="home--enkrypt" style="padding: 100px 0">
    <v-container>
      <div style="max-width: 400px">
        <img
          src="@/assets/images/icons/icon-enkrypt-full-logo.svg"
          alt="Enkrypt"
          height="28"
          class="mb-4"
        />
        <div class="text-title mb-5">
          Enkrypt - MEW's mulitchain browser extension
        </div>
        <div class="text-subtitle mb-10">
          Use thousands of web3 apps across multiple networks, buy crypto, swap
          tokens, and manage your NFTs. Welcome to the multichain future.
        </div>
        <mew-button
          class="download-button"
          color-theme="#7E44F2"
          style="border-radius: 100px !important"
          btn-size="large"
        >
          <img
            src="@/assets/images/icons/icon-chrome.svg"
            alt="Chrome"
            height="25"
            class="mr-2"
          />
          <span class="font-weight-bold"> Get the extension </span>
        </mew-button>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomeEnkrypt',
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.text-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 64px;
  letter-spacing: 0px;
}
.text-subtitle {
  font-size: 18px;
}
.download-button {
  img {
    border: 2px solid white;
    border-radius: 50%;
  }
}
</style>
