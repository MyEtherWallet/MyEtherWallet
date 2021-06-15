<template>
  <div class="component-container">
    <div class="py-10" />
    <v-container class="pb-0">
      <v-sheet max-width="600px" color="transparent" class="mx-auto">
        <app-block-title no-page-title :data="titleData" />
      </v-sheet>
      <div class="my-11" />
      <div class="line-height--0">
        <v-img
          src="@/assets/images/backgrounds/bg-mountains.png"
          max-width="100%"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'About Us',
      description:
        'MyEtherWallet - please, call us MEW - puts the Ethereum blockchain at your fingertips. We are a team of crypto-enthusiasts dedicated to bring you the most secure, most intuitive, and dare we say prettiest way to manage your ETH and ERC20 tokens. We are always here to help, and we are never giving away ETH. Cheers!',
      centered: true
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-color: #f2fafa;
}
.line-height--0 {
  line-height: 0 !important;
}
</style>
