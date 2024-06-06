<template>
  <div class="component-container position--relative">
    <div id="swap" class="pb-12 pb-lg-0">
      <img
        src="@/assets/images/backgrounds/bg-bubbles.png"
        class="d-none d-lg-block block-background-pattern"
      />
      <div class="py-6 py-md-12" />
      <v-container>
        <v-row>
          <v-col cols="12" lg="6">
            <v-img
              class="mb-8 block-image"
              src="@/assets/images/snippets/swap-page.png"
            />
          </v-col>
          <v-col cols="12" lg="6" class="text-content pl-lg-12">
            <app-block-title
              no-page-title
              :data="titleData"
              class="mb-12 pl-12"
            />
            <div class="mb-4 d-flex">
              <div class="mr-3">
                <v-img src="@/assets/images/currencies/icon-btc-white.svg" />
              </div>
              <div>
                <div class="mb-1 font-weight-bold subtitle-1 white--text">
                  {{ t('howItWorks.swap.info-one.title') }}
                </div>
                <p class="white--text">
                  {{ t('howItWorks.swap.info-one.text') }}
                </p>
              </div>
            </div>

            <div class="mb-4 d-flex">
              <div class="mr-3">
                <v-img src="@/assets/images/currencies//icon-eth-white.svg" />
              </div>
              <div>
                <div class="mb-1 font-weight-bold subtitle-1 white--text">
                  {{ t('howItWorks.swap.info-two.title') }}
                </div>
                <p class="white--text">
                  {{ t('howItWorks.swap.info-two.text') }}
                </p>
              </div>
            </div>

            <div class="d-flex">
              <div class="mr-3">
                <v-img src="@/assets/images/icons/icon-fiat-white.svg" />
              </div>
              <div>
                <div class="mb-1 font-weight-bold subtitle-1 white--text">
                  {{ t('howItWorks.swap.info-three.title') }}
                </div>
                <p class="white--text">
                  {{ t('howItWorks.swap.info-three.text') }}
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n-composable';

// injections
const { t } = useI18n();

// data
const titleData = {
  textProps: 'white--text',
  toptitle: '',
  title: t('howItWorks.swap.title'),
  description: t('howItWorks.swap.description'),
  centered: false
};
</script>

<style lang="scss" scoped>
.component-container {
  background-image: linear-gradient(to right, #f09819, #f9723f);
}

.block-background-pattern {
  position: absolute;
  top: 80px;
  left: 80px;
  height: 85%;
}

.block-image {
  box-shadow: 0px 0px 20px #0000001c;
}
</style>
