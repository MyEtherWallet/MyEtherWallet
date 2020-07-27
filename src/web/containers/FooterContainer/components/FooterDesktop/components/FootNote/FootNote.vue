<template>
  <div id="id-dab581eb596e6225d97b24f9856e3d70">
    <v-sheet color="dark_space" class="py-3">
      <v-container>
        <div class="d-flex align-center">
          <p class="cyan--text text--lighten-3 ma-0">V6.0.0-beta.3</p>
          <v-spacer />
          <p class="teal--text text--lighten-1 ma-0">
            ©2019 MyEtherWallet. All rights reserved. Pricing taken from
            <a class="cyan--text text--lighten-3" href="/">CoinMarketCap</a>.
          </p>
          <v-spacer />
          <v-sheet width="150" color="transparent">
            <v-select
              v-model="select"
              :items="languages"
              item-text="name"
              item-value="value"
              return-object
              single-line
              dark
            ></v-select>
          </v-sheet>
        </div>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
import uk from '@/assets/images/flags/uk.png';
import ru from '@/assets/images/flags/russia.png';
import kr from '@/assets/images/flags/korea.png';
import jp from '@/assets/images/flags/japan.png';
import ge from '@/assets/images/flags/germany.png';
import ch from '@/assets/images/flags/china.png';

export default {
  data: () => ({
    select: 'en',
    languages: [
      { name: 'English', value: 'en', flag: uk },
      { name: 'Russian', value: 'ru', flag: ru },
      { name: 'Germany', value: 'jp', flag: ge },
      { name: 'China', value: 'ch', flag: ch },
      { name: 'Korean', value: 'kr', flag: kr },
      { name: 'Japanese', value: 'jp', flag: jp }
    ]
  })
};
</script>

<style lang="scss" scoped>
.v-avatar img {
  border-radius: 0;
}
</style>

<style lang="scss">
#id-dab581eb596e6225d97b24f9856e3d70 {
  .v-select__selection {
    color: #80deea !important;
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
    color: #80deea !important;
  }
}
</style>
