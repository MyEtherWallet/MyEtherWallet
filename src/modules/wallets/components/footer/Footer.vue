<template>
  <div class="mew-component--wallet-footer">
    <v-sheet color="mewBg" class="py-6 px-10">
      <v-container class="d-flex align-center justify-space-between py-0">
        <div class="titlePrimary--text">
          ©2020 MyEtherWallet. All rights reserved. Pricing taken from
          <a class="text-decoration--none" href="/" targe="_blank"
            >CoinMarketCap</a
          >
        </div>
        <div class="d-flex align-center titlePrimary--text">
          <v-sheet width="150" color="transparent">
            <v-select
              v-model="select"
              append-icon="mdi-chevron-down"
              :items="languages"
              item-text="name"
              item-value="value"
              return-object
              single-line
              dark
            ></v-select>
          </v-sheet>
          <div class="mx-4">|</div>
          <div>Feedback</div>
          <div class="mx-4">|</div>
          <div>Support</div>
        </div>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    select: 'en',
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
  })
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
    margin-left: -15px;
  }

  .v-text-field,
  .v-input__slot {
    margin: 0;
    padding: 0;
  }
  .v-select .v-icon {
    color: var(--v-titlePrimary-base) !important;
  }
}
</style>
