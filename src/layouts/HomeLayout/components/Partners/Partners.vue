<template>
  <div class="home-partners">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Partners"
        description="Connect with the powerful crypto communities"
      />
      <v-row>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Ledger.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Trezor.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Bitbox.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Secalot.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Bity.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Sirin.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Keepkey.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Kyber.png" />
        </v-col>
        <v-col cols="3">
          <img src="@/assets/images/Etc/LandingPage/Partners/Changelly.png" />
        </v-col>
        <v-col cols="3">
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
