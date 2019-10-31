<template>
  <div class="light-blue darken-4 top-banner">
    <div class="banner-container pointer-event--none user-select--none">
      <img
        class="banner-img"
        src="@/assets/images/banners/homepage-top-banner.svg"
      />
    </div>
    <v-container class="banner-content-container">
      <v-row no-gutters>
        <v-col>
          <v-card color="transparent" flat tile max-width="500">
            <div class="white--text display-2 font-weight-bold">
              The most popular free Ethereum wallet
            </div>
            <div class="white--text mt-3">
              Generate the free Ethereum wallet, and interact with the Ethereum
              blockchain easily and securely.
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer'
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
.top-banner {
  position: relative;
}

.banner-container {
  position: relative;

  img {
  }
}

.banner-img {
  width: 100%;
}

.banner-content-container {
  height: 100%;
  position: absolute;
  top: 200px;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
