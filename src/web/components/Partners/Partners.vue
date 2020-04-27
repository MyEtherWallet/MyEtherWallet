<template>
  <div class="home-partners">
    <v-container>
      <BlockTitle :data="titleData" />
      <v-row class="mt-8 px-4">
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.ledger.com/?r=fa4b" target="_blank">
            <img src="@/assets/images/partners/ledger.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://trezor.io/?offer_id=12&aff_id=2029" target="_blank">
            <img src="@/assets/images/partners/trezor.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://shiftcrypto.ch/?ref=mew" target="_blank">
            <img src="@/assets/images/partners/bitbox.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.secalot.com/" target="_blank">
            <img src="@/assets/images/partners/secalot.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://bity.com/af/jshkb37v" target="_blank">
            <img src="@/assets/images/partners/bity.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://sirinlabs.com/" target="_blank">
            <img src="@/assets/images/partners/sirin.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="http://lddy.no/a4im" target="_blank">
            <img src="@/assets/images/partners/keepkey.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://kyber.network/" target="_blank">
            <img src="@/assets/images/partners/kyber.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://changelly.com/" target="_blank">
            <img src="@/assets/images/partners/changelly.png" />
          </a>
        </v-col>
        <v-col cols="3" md="3" lg="2">
          <a href="https://www.simplex.com/" target="_blank">
            <img src="@/assets/images/partners/simplex.png" />
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
