<template>
  <div>
    <div class="py-7" />
    <v-sheet max-width="600px" class="mx-auto">
      <div class="display-1 font-weight-black text-center">
        All-in-one gateway to your Ethereum Blockchain service
      </div>
    </v-sheet>
    <div class="py-10" />
    <v-row>
      <v-col cols="4" class="text-content">
        <BlockTitle
          title="Send"
          description="MyEtherWallet - please, call us MEW - puts the ETH blockchain at your
          fingertips."
          class="mb-8 pl-12"
        />
        <div class="mb-6 d-flex">
          <div class="mr-3">
            <v-img src="@/assets/images/Etc/AboutUs/Icons/Send.svg" />
          </div>
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
          <div class="mr-3">
            <v-img src="@/assets/images/Etc/AboutUs/Icons/Offline.svg" />
          </div>
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
          <div class="mr-3">
            <v-img src="@/assets/images/Etc/AboutUs/Icons/NFT.svg" />
          </div>
          <div>
            <div class="mb-1 font-weight-black subtitle-1">
              NFT Manager
            </div>
            <div>
              Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor sed
              stet takimata ipsum invidunt, est ea no dolor.
            </div>
            <div class="d-flex align-center mt-4">
              <a
                href="#"
                class="mr-5 teal--text text--lighten-2 font-weight-bold"
              >
                Try free demo
              </a>
              <a
                href="#"
                class="mr-5 teal--text text--lighten-2 font-weight-bold"
              >
                Watch tutorial
              </a>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="8">
        <v-img
          src="@/assets/images/Etc/AboutUs/InterfaceSendTransaction.png"
          class="mt-n6"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

a {
  text-decoration: underline;
}
</style>
