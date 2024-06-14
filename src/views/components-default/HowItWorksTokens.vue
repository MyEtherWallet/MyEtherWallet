<template>
  <div class="component-container position--relative">
    <img
      src="@/assets/images/backgrounds/bg-waves.svg"
      class="block-background-pattern"
    />
    <div class="py-6 py-md-12" />
    <v-container>
      <v-row>
        <v-col cols="12" lg="7">
          <v-img
            src="@/assets/images/snippets/my-tokens-table.png"
            class="mb-n7"
          />
        </v-col>
        <v-col cols="12" lg="5" class="text-content pl-lg-12 mt-12 mt-lg-0">
          <app-block-title
            no-page-title
            :data="titleData"
            class="mb-12 pl-12"
          />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-buy-token-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                {{ t('howItWorks.tokens.info-one.title') }}
              </div>
              <p class="white--text">
                {{ t('howItWorks.tokens.info-one.text') }}
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/currencies/icon-eth-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                {{ t('howItWorks.tokens.info-two.title') }}
              </div>
              <p class="white--text">
                {{ t('howItWorks.tokens.info-two.text') }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="py-6 py-md-12" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n-composable';

// injections
const { t } = useI18n();

const titleData = {
  textProps: 'white--text',
  toptitle: '',
  title: t('howItWorks.tokens.title'),
  description: t('howItWorks.tokens.description'),
  centered: false
};
</script>

<style lang="scss" scoped>
.component-container {
  background-image: linear-gradient(to right, #5378fc, #2091af);
}

.block-background-pattern {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
</style>
