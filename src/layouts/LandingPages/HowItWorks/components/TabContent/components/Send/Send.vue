<template>
  <div>
    <div class="py-7" />
    <v-sheet max-width="600px" class="mx-auto">
      <div class="display-1 font-weight-bold text-center">
        All-in-one gateway to your Ethereum Blockchain service
      </div>
    </v-sheet>
    <div class="py-10" />
    <v-row>
      <v-col cols="5" class="text-content pr-12">
        <BlockTitle :data="titleData" class="mb-8 pl-12" />
        <div class="mb-6 d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/mew/icon-send-mew.svg" />
          </div>
          <div>
            <div class="mb-1 font-weight-bold subtitle-1">
              Send Transaction
            </div>
            <p>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </p>
          </div>
        </div>

        <div class="mb-6 d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/mew/icon-offline-mew.svg" />
          </div>
          <div>
            <div class="mb-1 font-weight-bold subtitle-1">
              Send Offline Helper
            </div>
            <p>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </p>
          </div>
        </div>

        <div class="d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/icons/mew/icon-nft-mew.svg" />
          </div>
          <div>
            <div class="mb-1 font-weight-bold subtitle-1">NFT Manager</div>
            <p>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </p>
            <div class="d-flex align-center mt-4">
              <a
                href="#"
                class="mr-5 teal--text text--lighten-2 font-weight-bold"
                >Try free demo</a
              >
              <a
                href="#"
                class="mr-5 teal--text text--lighten-2 font-weight-bold"
                >Watch tutorial</a
              >
              >
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="7">
        <v-img src="@/assets/images/snippets/send-tx-page.png" class="mt-n6" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BlockTitle from '../../../../../components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Send',
      description:
        'MyEtherWallet - please, call us MEW - puts the ETH blockchain at your fingertips.',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: underline;
}
</style>
