<template>
  <div>
    <div class="py-7" />
    <v-sheet max-width="600px" class="mx-auto">
      <div class="display-1 font-weight-black text-center">
        All-in-one gateway to your Ethereum Blockchain service
      </div>
    </v-sheet>
    <BlockTitle :title="titleText" centered />
    <div class="py-8" />
    <v-row>
      <v-col cols="4" class="text-content">
        <BlockTitle
          title="Send"
          description="MyEtherWallet - please, call us MEW - puts the ETH blockchain at your
          fingertips."
          class="mb-10"
        />
        <div class="mb-6 d-flex">
          <div>111</div>
          <div>
            <div class="mb-1 font-weight-black subtitle-1">
              Send Transaction
            </div>
            <div>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </div>
          </div>
        </div>

        <div class="mb-6 d-flex">
          <div>111</div>
          <div>
            <div class="mb-1 font-weight-black subtitle-1">
              Send Offline Helper
            </div>
            <div>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </div>
          </div>
        </div>

        <div class="d-flex">
          <div>111</div>
          <div>
            <div class="mb-1 font-weight-black subtitle-1">
              NFT Manager
            </div>
            <div>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </div>
          </div>
        </div>
      </v-col>
      <v-col>Send Transction</v-col>
    </v-row>
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleText: ''
  })
};
</script>

<style lang="scss" scoped>
.text-content {
}
</style>
