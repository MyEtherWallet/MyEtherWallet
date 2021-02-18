<template>
  <v-footer color="mewBg" class="pa-0" inset app>
    <v-container
      class="py-0 px-10 d-flex align-center justify-space-between"
      fluid
    >
      <div class="textSecondary--text">
        ©2020 MyEtherWallet. All rights reserved. Pricing taken from
        <a
          class="titlePrimary--text text-decoration--none"
          href="/"
          targe="_blank"
          >CoinMarketCap</a
        >
      </div>
      <div class="d-flex align-center titlePrimary--text">
        <span>Feedback</span>
        <span class="mx-2">|</span>
        <span>Support</span>
        <span class="mx-2">|</span>
        <v-select
          v-model="onLanguage"
          class="language-select"
          append-icon="mdi-chevron-down"
          :items="languages"
          item-text="name"
          item-value="value"
          return-object
          single-line
        ></v-select>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  components: {},
  data: () => ({
    onLanguage: null,
    languages: [
      {
        name: 'English',
        value: 'en',
        flag: require('@/assets/images/flags/uk.png')
      },
      {
        name: 'Russian',
        value: 'ru',
        flag: require('@/assets/images/flags/russia.png')
      },
      {
        name: 'Germany',
        value: 'ge',
        flag: require('@/assets/images/flags/germany.png')
      },
      {
        name: 'China',
        value: 'ch',
        flag: require('@/assets/images/flags/china.png')
      },
      {
        name: 'Korean',
        value: 'kr',
        flag: require('@/assets/images/flags/korea.png')
      },
      {
        name: 'Japanese',
        value: 'jp',
        flag: require('@/assets/images/flags/japan.png')
      }
    ]
  }),
  mounted() {
    this.onLanguage = this.languages[0].value;
  }
};
</script>
<style lang="scss" scoped>
.language-select {
  max-width: 130px;
  margin-top: 10px;
}
</style>
