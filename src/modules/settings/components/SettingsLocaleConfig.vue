<template>
  <div class="pa-6">
    <v-sheet color="transparent" max-width="550px" class="mb-7 locale-config">
      <mew-select
        ref="mewSelect"
        label="Language"
        filter-placeholder="Search language"
        :items="languages"
        :value="language"
        :is-custom="true"
        @input="setLanguage"
      />
      <mew-select
        ref="mewSelect"
        label="Currency"
        class="testing"
        filter-placeholder="Search currency"
        :items="currencies"
        :value="currency"
        :is-custom="true"
        @input="setCurrency"
      />
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import USDIcon from '@/assets/images/currencies/USD.svg';
import RUBIcon from '@/assets/images/currencies/RUB.svg';
export default {
  name: 'SettingsLocaleConfig',
  data() {
    return {
      language: { name: 'English', value: 'en_US', img: USDIcon },
      currency: { name: 'USD', value: 'USD', img: USDIcon }
    };
  },
  computed: {
    ...mapState('global', ['locale', 'preferredCurrency']),
    languages() {
      const languageList = [
        { name: 'English', value: 'en_US', img: USDIcon, price: null },
        { name: 'Русский', value: 'ru_RU', img: RUBIcon }
      ];
      const imgs = languageList.map(l => l.img);
      return [
        {
          imgs,
          divider: true,
          selectLabel: true
        },
        ...languageList
      ];
    },
    currencies() {
      const currencyList = [
        { name: 'USD', value: 'USD', img: USDIcon },
        { name: 'Ruble', value: 'RUB', img: RUBIcon }
      ];
      const imgs = currencyList.map(c => c.img);
      return [
        {
          imgs,
          divider: true
        },
        ...currencyList
      ];
    }
  },
  mounted() {
    console.log(document.querySelector('.locale-config'));
  },
  methods: {
    setLanguage(value) {
      document.querySelector('html').setAttribute('lang', value);
      this.language = value;
    },
    setCurrency(value) {
      this.currency = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.locale-config >>> .v-menu__content .align-end {
  display: none !important;
}
</style>
