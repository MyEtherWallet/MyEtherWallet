<template>
  <div class="mew-component--advertise-with-us">
    <div class="desktop-content d-none d-lg-block expandHeader">
      <v-container class="banner-content-container pt-10">
        <div
          :class="[
            $vuetify.breakpoint.mdAndDown ? 'mew-subtitle' : 'mew-title',
            'font-weight-regular white--text'
          ]"
        >
          Get your brand in front of tens of thousands
          <br class="d-none d-md-inline" />
          of MyEtherWallet users.
        </div>
        <v-row class="pl-12">
          <v-col cols="4" class="pt-12 d-flex align-start">
            <div
              class="py-3 px-5 text-center white--text d-flex align-center flex-column work-together-container"
            >
              <span class="mew-heading-4">
                Let's work together to achieve <br />
                your marketing goals!</span
              >
              <mew-button
                class="mt-4"
                btn-style="background"
                color-theme="primary"
                btn-size="xlarge"
                title="Contact Us"
                @click.native="scrollToForm"
              />
            </div>
          </v-col>
          <v-col cols="8" class="pt-12">
            <img
              src="@/assets/images/backgrounds/mew-orbit.png"
              alt="mew orbit"
              max-width="800px"
              width="100%"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none expandHeader pt-5">
      <v-container>
        <div class="mew-title font-weight-regular white--text text-center">
          Get your brand in front of tens of thousands of MyEtherWallet users.
        </div>
        <v-row>
          <v-col cols="12" class="pt-4">
            <img
              src="@/assets/images/backgrounds/mew-orbit.png"
              alt="mew orbit"
              max-width="400px"
              width="100%"
            />
          </v-col>
          <v-col cols="12" class="pt-12 d-flex align-center justify-center">
            <div
              class="py-3 px-5 text-center white--text d-flex align-center flex-column work-together-container"
            >
              <span class="mew-heading-4">
                Let's work together to achieve <br />
                your marketing goals!</span
              >
              <mew-button
                class="mt-4"
                btn-style="background"
                color-theme="primary"
                btn-size="xlarge"
                title="Contact Us"
                @click.native="scrollToForm"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvertiseBanner',
  components: {},
  methods: {
    scrollToForm() {
      const element = document.getElementsByClassName('title-anchor-ad-mew');
      window.scrollTo(0, element[0].offsetTop);
    }
  }
};
</script>

<style lang="scss" scoped>
.desktop-content {
  background-image: url(~@/assets/images/backgrounds/bg-ad-with-us.png);
  background-size: cover;
  background-position: 100% bottom;
  box-shadow: 0px 25px 30px 0px #a6adc938;

  .banner-content-container {
    height: 800px;
  }
}

.mobile-content {
  background-image: url(~@/assets/images/backgrounds/bg-ad-with-us.png);
  background-position: bottom center;
  background-size: auto;
  padding: 0 0 15rem 0;
  box-shadow: 0px 25px 30px 0px #a6adc938;
}

.work-together-container {
  border: 1px solid white;
  border-radius: 5px;
}
</style>
