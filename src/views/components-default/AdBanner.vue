<template>
  <div class="mew-component--advertise-with-us">
    <div class="desktop-content d-none d-lg-block expandHeader elevation-2">
      <v-container class="banner-content-container pt-10">
        <div class="mew-title font-weight-regular white--text">
          Get your brand in front of tens of thousands <br />
          of MyEtherWallet users.
        </div>
        <v-row class="pl-12">
          <v-col cols="4" class="pt-12">
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
              />
            </div>
          </v-col>
          <v-col cols="8" class="pt-12">
            <img
              src="@/assets/images/icons/mew-orbit.png"
              alt="mew orbit"
              max-width="800px"
              width="100%"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none expandHeader pt-5 elevation-2">
      <v-container>
        <v-card color="transparent" flat tile max-width="400px" class="mx-auto">
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvertiseBanner',
  components: {},
  data() {
    return {};
  }
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
  background-image: url(~@/assets/images/backgrounds/bg-ad-with-us.png);
  background-position: bottom center;
  background-size: 88rem;
  padding: 0 0 30rem 0;
}

.extension-btns {
  color: white;
  background: rgba(0, 0, 0, 0.12);
}

.browser-icons {
  width: 25px;
  height: 25px;
}

.app-icons {
  width: 55px;
  max-height: 55px;
}

.work-together-container {
  border: 1px solid white;
  border-radius: 5px;
}
</style>
