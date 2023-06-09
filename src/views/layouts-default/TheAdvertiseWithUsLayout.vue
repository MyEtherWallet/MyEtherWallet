<template>
  <div class="mew-component--landing">
    <div class="desktop-content d-none d-lg-block expandHeader">
      <v-container
        class="banner-content-container d-flex align-center justify-space-between"
      >
        <v-card color="transparent" flat tile max-width="430px">
          <div class="white--text mew-title">
            <span>
              {{ $t('home.tagline1') | lokalise('home.tagline1') }}
            </span>
            <span>
              {{ $t('home.tagline2') | lokalise('home.tagline2') }}
            </span>
          </div>
          <p class="white--text mt-3">
            {{ $t('home.subheading') | lokalise('home.subheading') }}
          </p>
          <div class="mt-9 d-flex">
            <mew-button
              class="mr-3 HomeCreateWallet"
              :has-full-width="false"
              title="Create a new wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.CREATE_WALLET.NAME,
                  params: {}
                })
              "
            />
            <mew-button
              class="HomeAccessWallet"
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.ACCESS_WALLET.NAME,
                  params: {}
                })
              "
            />
          </div>
          <div class="d-flex">
            <mew-button
              class="extension-btns chrome-extension text-transform--none mt-5 mr-2"
              :has-full-width="false"
              btn-style="transparent"
              color-theme="white"
              btn-size="large"
              style="border-radius: 40px !important"
              btn-link="https://www.enkrypt.com"
              rel="dofollow"
            >
              <img class="mr-3 browser-icons" :src="browserLogo" />
              Get the Enkrypt Extension
            </mew-button>
            <mew-button
              class="extension-btns app-extension mt-5"
              :has-full-width="false"
              btn-style="transparent"
              color-theme="white"
              btn-size="large"
              style="border-radius: 40px !important"
              @click.native="openMewWallet"
            >
              <img
                class="mr-2 app-icons"
                src="@/assets/images/icons/icon-apple-google.svg"
              />
              Get the app
            </mew-button>
          </div>
        </v-card>
        <img
          src="@/assets/images/backgrounds/bg-home-spaceman-and-dog.svg"
          alt="Spaceman and his dog"
          height="500"
        />
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none expandHeader pt-5">
      <v-container>
        <v-card color="transparent" flat tile max-width="400px" class="mx-auto">
          <div
            class="white--text font-weight-bold mb-4"
            style="font-size: 3rem; line-height: 3.3rem"
          >
            <span>
              {{ $t('home.tagline1') | lokalise('home.tagline2') }}
            </span>
            <span>
              {{ $t('home.tagline2') | lokalise('home.tagline2') }}
            </span>
          </div>
          <p class="white--text mt-3">
            {{ $t('home.subheading') | lokalise('home.subheading') }}
          </p>
          <div class="mt-12">
            <mew-button
              class="mb-3 width--full"
              :has-full-width="false"
              title="Create a new wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.CREATE_WALLET.NAME,
                  params: {}
                })
              "
            />
            <mew-button
              class="width--full"
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              btn-size="xlarge"
              @click.native="
                $router.push({
                  name: ROUTES_HOME.ACCESS_WALLET.NAME,
                  params: {}
                })
              "
            />
            <mew-button
              class="extension-btns chrome-extension text-transform--none mt-5 mb-2"
              :has-full-width="true"
              btn-style="transparent"
              color-theme="white"
              btn-size="large"
              style="border-radius: 40px !important"
              btn-link="https://www.enkrypt.com"
              rel="dofollow"
            >
              <img class="mr-3 browser-icons" :src="browserLogo" />
              Get the Enkrypt Extension
            </mew-button>
            <mew-button
              class="extension-btns app-extension"
              :has-full-width="true"
              btn-style="transparent"
              color-theme="white"
              btn-size="large"
              style="border-radius: 40px !important"
              @click.native="openMewWallet"
            >
              <img
                class="mr-2 app-icons"
                src="@/assets/images/icons/icon-apple-google.svg"
              />
              Get the app
            </mew-button>
          </div>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'HomeLanding',
  components: {},
  data() {
    return { ROUTES_HOME: ROUTES_HOME };
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
  background-image: url('~@/assets/images/backgrounds/bg-homepage-spaceman-center.svg');
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
</style>
