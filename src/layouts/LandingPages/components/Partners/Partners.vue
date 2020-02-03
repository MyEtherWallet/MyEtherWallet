<template>
  <div class="home-partners">
    <v-container>
      <BlockTitle :data="titleData" />
      <v-row class="mt-8 px-4">
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.ledger.com/?r=fa4b" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Ledger.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://trezor.io/?offer_id=12&aff_id=2029" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Trezor.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://shiftcrypto.ch/?ref=mew" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Bitbox.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.secalot.com/" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Secalot.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://bity.com/af/jshkb37v" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Bity.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://sirinlabs.com/" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Sirin.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="http://lddy.no/a4im" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Keepkey.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://kyber.network/" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Kyber.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://changelly.com/" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Changelly.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.simplex.com/" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Simplex.png" />
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../BlockTitle';

export default {
  name: 'HomePartners',
  components: {
    BlockTitle
  },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: 'Partners',
      title: 'Connect with the powerful crypto communities',
      description: '',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
