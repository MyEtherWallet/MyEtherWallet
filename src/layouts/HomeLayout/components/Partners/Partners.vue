<template>
  <div class="home-partners">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Partners"
        description="Connect with the powerful crypto communities"
      />
      <v-row class="mt-8 px-4">
        <v-col cols="2">
          <a href="https://www.ledger.com/?r=fa4b" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Ledger.png" />
          </a>
        </v-col>
        <v-col cols="2">
          <a href="https://trezor.io/?offer_id=12&aff_id=2029" target="_blank">
            <img src="@/assets/images/Etc/LandingPage/Partners/Trezor.png" />
          </a>
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Bitbox.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Secalot.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Bity.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Sirin.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Keepkey.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Kyber.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Changelly.png" />
        </v-col>
        <v-col cols="2">
          <img src="@/assets/images/Etc/LandingPage/Partners/Simplex.png" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../Common/BlockTitle';

export default {
  name: 'HomePartners',
  components: {
    BlockTitle
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
