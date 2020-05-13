<template>
  <div>
    <!-- need to translate -->
    <v-container>
      <BlockTitle
        :data="titleData"
        :centered="false"
        toptitle="Why Mew"
        title="Make Ethereum Blockchain easy and secure"
      />
      <div class="pt-10 d-flex align-center justify-center">
        <!-- change placeholder for all the urls -->
        <info-card
          max-width="350"
          :link="{ title: 'Learn more', url: 'www.google.com' }"
          :icon="iconFacesMew"
          title="Friendly user interface"
          desc="Access the Ethereum blockchain's
        original and most-trusted wallet client, now with a host of new features
        all contained in an elegant, easy and friendly interface."
        />
        <div class="d-flex flex-column ml-10">
          <info-card
            max-width="500"
            :link="{ title: 'Learn more', url: 'www.google.com' }"
            title="Swap easily"
            desc="Partnered with Bity, Kyber Network, Changelly, and Simplex  to allow users to swap fiat to crypto, ETH to BTC, ETH to ERC-20."
          >
            <template v-slot:cardImg>
              <img
                class="icon-half-circle"
                src="@/assets/images/icons/icon-half-circle-mew.svg"
              />
            </template>
          </info-card>
          <info-card
            class="mt-10"
            max-width="500"
            :link="{ title: 'Learn more', url: 'www.google.com' }"
            title="Hardware wallet support"
            desc="MEW offers support for all major hardware wallets including Leder, Trezor,
            and many more."
          />
        </div>
        <info-card
          class="ml-10"
          max-width="320"
          :link="{ title: 'Get the App', url: 'www.google.com' }"
          title="MEWwallet"
          desc="MEW brings a hardware wallet style security to your iOS or Android smart phone, helping you to secure your funds as never before."
        >
          <template v-slot:titleIconContainer>
            <img
              class="ml-2"
              src="@/assets/images/icons/icon-appstore-apple-dark.svg"
            />
            <img
              class="ml-2"
              src="@/assets/images/icons/icon-appstore-android-dark.svg"
            />
          </template>
          <template v-slot:cardImg>
            <div class="text-center">
              <img
                class="mew-wallet-img"
                src="@/assets/images/snippets/mobile/mobile-mew-connect.png"
              />
            </div>
          </template>
        </info-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import iconFacesMew from '@/assets/images/icons/icon-faces-mew.svg';

export default {
  name: 'HomeWhyMew',
  components: {
    BlockTitle
  },
  data: () => ({
    iconFacesMew: iconFacesMew,
    titleData: {
      textProps: '',
      toptitle: 'Why Mew',
      title: 'Make Ethereum Blockchain easy and secure',
      description: '',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.icon-half-circle {
  bottom: 0;
  position: absolute;
  right: -17px;
  // top: 119px;
}

.mew-wallet-img {
  margin-bottom: -7px;
}
</style>
