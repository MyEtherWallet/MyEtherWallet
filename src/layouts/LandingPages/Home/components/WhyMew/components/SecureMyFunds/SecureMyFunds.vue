<template>
  <v-card class="pa-8 pb-0 d-flex flex-column" outlined max-width="300">
    <h4 class="link-box-title font-weight-bold mb-4">
      Secure my funds
    </h4>
    <p>
      MEWconnect, an official, free companion app for MEW that helps you secure
      your funds as never before.
    </p>
    <div class="action-block mt-2 ml-n4">
      <v-btn color="teal lighten-3" class="font-weight-bold" text>
        Learn more<v-icon class="ml-1 title">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <div class="d-flex flex-row align-center mt-2">
      <div class="mr-2">Download on</div>
      <img
        class="mr-1"
        src="@/assets/images/Etc/LandingPage/appstore-apple.svg"
      />
      <img src="@/assets/images/Etc/LandingPage/appstore-android.svg" />
    </div>
    <v-spacer />
    <div class="line-height--0 text-center">
      <img src="@/assets/images/Etc/LandingPage/mew-connect.png" />
    </div>
  </v-card>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss" scoped>
h4 {
  font-size: 22px;
  letter-spacing: -0.6px;
}

.v-card {
  border-radius: 10px !important;
}
</style>
