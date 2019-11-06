<template>
  <div class="home-partners">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Partners"
        description="Connect with the powerful crypto communities"
      />
      <v-row>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
        <v-col cols="2">1</v-col>
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
