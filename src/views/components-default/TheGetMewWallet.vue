<template>
  <div class="component--the-get-mew-wallet width--full">
    <v-alert
      :value="alert"
      color="white"
      elevation="15"
      transition="scroll-y-transition"
    >
      <div class="left-btn primary--text">
        More <v-icon color="primary">mdi-chevron-down</v-icon>
      </div>
      <div class="right-btn">
        <v-btn icon @click="alert = !alert">
          <v-icon color="textSecondary">mdi-close</v-icon>
        </v-btn>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" lg="4" class="text-center">
            <img
              src="@/assets/images/partners/services/skale.svg"
              alt="Skale"
              height="40"
            />
            <div class="mew-heading-3 mt-1">SKL Skating new on iOS!</div>
          </v-col>
          <v-col
            cols="12"
            lg="8"
            class="d-flex align-center justify-center mx-auto"
          >
            <v-row>
              <v-col
                cols="12"
                lg="6"
                class="
                  mew-heading-1
                  text-center
                  d-flex
                  align-center
                  justify-center
                "
              >
                Get the official MEW wallet app
              </v-col>
              <v-col
                cols="12"
                lg="6"
                style="line-height: 0"
                class="text-center"
              >
                <div class="d-flex align-center justify-center flex-wrap">
                  <a
                    href="https://apps.apple.com/app/id1464614025"
                    target="_blank"
                  >
                    <img
                      src="@/assets/images/icons/button-app-store.svg"
                      alt="Apple App Store"
                      height="40"
                      class="mx-2 my-1"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet"
                    target="_blank"
                  >
                    <img
                      src="@/assets/images/icons/button-play-store.svg"
                      alt="Google Play Store"
                      height="40"
                      class="mx-2 my-1"
                    />
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-alert>
  </div>
</template>
<script>
export default {
  name: 'TheGetMewWallet',
  props: {},
  data() {
    return {
      alert: true
    };
  }
};
</script>

<style lang="scss" scoped>
.component--the-get-mew-wallet {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2147483004;
}

.v-alert {
  margin-bottom: 0;
  border-radius: 0 !important;
}

.left-btn {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 1;
}

.right-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 1;
}
</style>
