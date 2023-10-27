<template>
  <div class="mew-component--app-get-started">
    <!-- Desktop design -->
    <div class="desktop-content d-none d-lg-block">
      <v-container>
        <div class="d-flex align-center px-6">
          <div>
            <h1 class="white--text mb-3">
              {{ $t('home.get-started.heading') }}
            </h1>
            <div align="left" class="mt-5">
              <a
                href="https://download.mewwallet.com/?source=mew_web_create"
                target="_blank"
                class="mr-1"
                @click="trackOpenMEWWallet"
              >
                <img
                  v-lazy="require('@/assets/images/icons/button-app-store.svg')"
                  alt="Apple app store"
                  height="35"
                />
              </a>
              <a
                href="https://download.mewwallet.com/?source=mew_web_create"
                target="_blank"
                @click="trackOpenMEWWallet"
              >
                <img
                  v-lazy="
                    require('@/assets/images/icons/button-play-store.svg')
                  "
                  alt="Google play store"
                  height="35"
                />
              </a>
            </div>
          </div>

          <v-spacer />

          <div class="d-flex">
            <mew-button
              color-theme="primary"
              btn-style="background"
              class="mr-4"
              :title="$t('home.get-started.button-text-one')"
              btn-size="xlarge"
              @click.native="navigateToCreateWallet"
            />
            <mew-button
              color-theme="primary"
              btn-style="outline"
              :title="$t('home.get-started.button-text-two')"
              btn-size="xlarge"
              @click.native="navigateToAccessWallet"
            />
          </div>
        </div>
      </v-container>
    </div>

    <!-- Mobile design -->
    <div class="mobile-content d-block d-lg-none">
      <v-container class="px-5">
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <div class="mb-9">
            <h1 class="white--text">{{ $t('home.get-started.heading') }}</h1>
            <div align="left" class="mt-5">
              <a
                href="https://download.mewwallet.com/?source=mew_web_create"
                target="_blank"
                class="mr-1"
                @click="() => trackOpenMEWWallet('AppleStore2')"
              >
                <img
                  v-lazy="require('@/assets/images/icons/button-app-store.svg')"
                  alt="Apple app store"
                  height="35"
                />
              </a>
              <a
                href="https://download.mewwallet.com/?source=mew_web_create"
                target="_blank"
                @click="() => trackOpenMEWWallet('GoogleStore3')"
              >
                <img
                  v-lazy="
                    require('@/assets/images/icons/button-play-store.svg')
                  "
                  alt="Google play store"
                  height="35"
                />
              </a>
            </div>
          </div>
          <v-row>
            <v-col cols="12" sm="6" class="mr-n2 mb-n2">
              <mew-button
                has-full-width
                :title="$t('home.get-started.button-text-one')"
                btn-size="xlarge"
                @click.native="navigateToCreateWallet"
              />
            </v-col>
            <v-col cols="12" sm="6" class="mb-n2">
              <mew-button
                has-full-width
                btn-style="outline"
                :title="$t('home.get-started.button-text-two')"
                btn-size="xlarge"
                @click.native="navigateToAccessWallet"
              />
            </v-col>
          </v-row>
        </v-sheet>
      </v-container>
    </div>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
export default {
  name: 'GetStarted',
  mixins: [handlerAnalytics],
  data() {
    return {};
  },
  methods: {
    trackOpenMEWWallet(name) {
      this.trackLandingPageAmplitude(name);
    },
    navigateToCreateWallet() {
      this.trackLandingPageAmplitude('CreateWallet2');
      this.$router.push({
        name: ROUTES_HOME.CREATE_WALLET.NAME,
        params: {}
      });
    },
    navigateToAccessWallet() {
      this.trackLandingPageAmplitude('AccessWallet2');
      this.$router.push({
        name: ROUTES_HOME.ACCESS_WALLET.NAME,
        params: {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--app-get-started {
  background-color: var(--v-expandHeader-base) !important;
}
.desktop-content {
  padding: 80px 0;
}
.mobile-content {
  padding: 4rem 0;
}
</style>

<style lang="scss">
.mew-component--app-get-started {
  .desktop-content {
    .v-btn {
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
      height: 70px !important;
      .icon img {
        height: 50px;
        margin-right: 5px;
      }
    }
  }
  .mobile-content {
    .v-btn {
      padding: 0 2.5rem !important;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
      height: 70px !important;
      .icon img {
        height: 50px;
        margin-right: 5px;
      }
    }
  }
}
</style>
