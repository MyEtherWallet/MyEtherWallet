<template>
  <div class="component-container">
    <v-container>
      <div class="py-6" />
      <v-row>
        <v-col cols="6">
          <v-img
            src="@/assets/images/Etc/AboutUs/InterfaceSwap.svg"
            class="mt-n6"
          />
        </v-col>
        <v-col cols="6" class="text-content">
          <BlockTitle :data="titleData" class="mb-8 pl-12" />
          <div class="mb-6 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/Etc/AboutUs/Icons/Send.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-black subtitle-1">
                Send Transaction
              </div>
              <div>
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
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
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
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
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
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
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Swap',
      description: 'MEW has partnered with Bity',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-image: linear-gradient(to right, #f09819, #f9723f);
}
</style>
