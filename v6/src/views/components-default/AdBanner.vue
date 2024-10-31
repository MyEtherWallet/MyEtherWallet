<template>
  <div class="mew-component--advertise-with-us pb-md-15">
    <div class="desktop-content d-none d-lg-block expandHeader">
      <v-container class="banner-content-container pt-16">
        <div
          :class="[
            $vuetify.breakpoint.mdAndDown ? 'mew-subtitle' : 'mew-title',
            'font-weight-regular white--text mb-11 mt-16'
          ]"
        >
          Advertise with MEW
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
                btn-link="mailto:@info@myetherwallet.com"
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
        <div
          class="mew-title font-weight-regular white--text text-center mt-16"
        >
          Advertise With MEW
        </div>
        <v-row no-gutters>
          <v-col cols="12" class="pt-4 text-center">
            <img
              src="@/assets/images/backgrounds/mew-orbit.png"
              alt="mew orbit"
              class="orbit-img"
              width="100%"
            />
          </v-col>
          <v-col cols="12" class="pt-12 d-flex align-center justify-center">
            <div
              class="pa-5 text-center white--text d-flex align-center flex-column work-together-container"
            >
              <span class="mew-heading-4 font-weight-bold">
                Let's work together to achieve <br />
                your marketing goals!</span
              >
              <mew-button
                class="mt-4"
                btn-style="background"
                color-theme="primary"
                btn-size="xlarge"
                title="Contact Us"
                btn-link="mailto:@info@myetherwallet.com"
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
  name: 'AdvertiseBanner'
};
</script>

<style lang="scss" scoped>
.desktop-content {
  background-image: url(~@/assets/images/backgrounds/bg-ad-with-us.png);
  background-size: cover;
  background-position: 100% bottom;

  .banner-content-container {
    height: 800px;
  }
}

.mobile-content {
  background-position: bottom center;
  background-size: auto;
  padding: 0 0 6rem 0;
}

.work-together-container {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
}

.orbit-img {
  max-width: 500px;
}
</style>
