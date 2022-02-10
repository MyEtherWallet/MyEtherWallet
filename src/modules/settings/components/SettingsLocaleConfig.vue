<template>
  <div class="pa-6">
    <v-sheet color="transparent" max-width="550px" class="mb-7 locale-config">
      <!--
        All commented code is related to language setting
      -->
      <!-- <mew-select
        ref="mewSelect"
        label="Language"
        filter-placeholder="Search language"
        :items="languages"
        :value="language"
        :is-custom="true"
        @input="setLanguage"
      /> -->
      <mew-select
        ref="mewSelect"
        label="Currency"
        class="testing"
        filter-placeholder="Search currency"
        :items="currencies"
        :value="currency"
        :is-custom="true"
        @input="setCurrencyType"
      />
    </v-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import USDIcon from '@/assets/images/currencies/USD.svg';
import RUBIcon from '@/assets/images/currencies/RUB.svg';
// import {loadLanguageAsync} from '@/main/i18n';
export default {
  name: 'SettingsLocaleConfig',
  data() {
    return {
      // language: { name: 'English', value: 'en_US', img: USDIcon },
      currencyList: [
        { name: 'USD', value: 'USD', img: USDIcon },
        { name: 'RUB', value: 'RUB', img: RUBIcon }
      ],
      currency: {}
    };
  },
  computed: {
    ...mapState('global', ['locale', 'preferredCurrency']),
    // languages() {
    //   const languageList = [
    //     { name: 'English', value: 'en_US', img: USDIcon },
    //     { name: 'Русский', value: 'ru_RU', img: RUBIcon }
    //   ];
    //   const imgs = languageList.map(l => l.img);
    //   return [
    //     {
    //       imgs,
    //       divider: true,
    //       selectLabel: true
    //     },
    //     ...languageList
    //   ];
    // },
    currencies() {
      const imgs = this.currencyList.map(c => c.img);
      return [
        {
          imgs,
          divider: true
        },
        ...this.currencyList
      ];
    },
    getCurrentCurrency() {
      return this.currencyList.find(c => c.value === this.preferredCurrency);
    }
  },
  mounted() {
    this.currency = this.getCurrentCurrency;
  },
  methods: {
    ...mapActions('global', ['setLocale', 'setPreferredCurrency']),
    ...mapActions('external', ['setCurrency']),
    // setLanguage(value) {
    //   document.querySelector('html').setAttribute('lang', value.value);
    //   loadLanguageAsync(value.value);
    //   this.setLocale(value.value);
    // },
    setCurrencyType(value) {
      this.setPreferredCurrency(value.value);
      this.setCurrency(value.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.locale-config >>> .v-menu__content .align-end {
  display: none !important;
}
</style>
