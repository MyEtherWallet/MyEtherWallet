<template>
  <v-footer color="mewBg" class="mew-component--wallet-footer pa-0" inset app>
    <v-container
      class="py-6 px-10 d-flex align-center justify-space-between"
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
        <span class="mx-5">|</span>
        <span>Support</span>
        <span class="mx-5">|</span>
        <v-select
          v-model="onLanguage"
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

<style lang="scss">
.mew-component--wallet-footer {
  .v-select__selection {
    color: var(--v-titlePrimary-base) !important;
    width: 100%;
    text-align: right;
  }

  .v-text-field > .v-input__control > .v-input__slot:before,
  .v-text-field > .v-input__control > .v-input__slot:after,
  .v-select.v-text-field input,
  .v-text-field__details {
    display: none;
  }

  .v-text-field .v-input__append-inner {
    margin-left: -5px;
  }

  .v-text-field,
  .v-input__slot {
    margin: 0;
    padding: 0;
  }

  .v-select .v-icon {
    color: var(--v-titlePrimary-base) !important;
  }

  .v-select__selection {
    max-width: 100%;
    text-overflow: unset !important;
  }
}
</style>
