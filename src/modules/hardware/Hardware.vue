<template>
  <div class="expandHeader pb-12">
    <block-title :data="titleData" />

    <v-sheet color="transparent" max-width="1000px" class="mx-auto">
      <v-row>
        <v-col v-for="(b, key) in buttons" :key="key" cols="6">
          <a :href="b.link" target="_blank">
            <v-sheet color="white" class="border-radius--10px pa-10">
              <div class="d-flex align-center justify-space-between">
                <div class="pr-9">
                  <img
                    v-if="b.logoImg"
                    height="32"
                    :src="b.logoImg"
                    alt="Logo"
                    class="mb-3"
                  />
                  <div
                    v-if="b.logoText"
                    class="d-flex align-center logo-text mb-3"
                  >
                    <div>{{ b.logoText }}</div>
                  </div>
                  <h6
                    class="text-uppercase font-weight-bold primary--text text--lighten-1"
                  >
                    {{ b.priceNote }}
                  </h6>

                  <div class="d-flex">
                    <h5 class="mr-1 font-weight-black">{{ b.currency }}</h5>
                    <h3 class="text-uppercase font-weight-bold">
                      {{ b.price }}
                    </h3>
                  </div>
                  <div>
                    {{ b.note }}
                  </div>
                  <div class="mt-3 primary--text font-weight-medium">
                    Learn more >
                  </div>
                </div>
                <div>
                  <img
                    class="wallet-img"
                    :src="b.walletImg"
                    alt="Hardware Wallet"
                  />
                </div>
              </div>
            </v-sheet>
          </a>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  name: 'HowItWorks',
  components: { blockTitle },
  data: () => ({
    buttons: [
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-ledger.svg'),
        walletImg: require('@/assets/images/hardware-wallets/ledger.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '59.00',
        note: 'Easy to carry everywhere thanks to its USB format.',
        link: 'https://www.ledger.com/'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/trezor.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-keepkey.png'),
        walletImg: require('@/assets/images/hardware-wallets/keepkey.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoText: 'BitBox',
        //logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/bitbox.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-secalot.png'),
        walletImg: require('@/assets/images/hardware-wallets/secalot.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoText: 'ETHER.CARDS',
        //logoImg: require('@/assets/images/hardware-wallets/logo-ethercards.png'),
        walletImg: require('@/assets/images/hardware-wallets/bitmap.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoText: 'FINNEY',
        //logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/finney.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-billfodl.png'),
        walletImg: require('@/assets/images/hardware-wallets/billfodl.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'Unmatched physical security for your private keys.',
        link: 'https://trezor.io/'
      }
    ],
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Get a hardware wallet today!',
      description:
        'The Hardware wallet offer the highest security for accessing your crypto.',
      centered: true
    }
  })
};
</script>

<style lang="scss" scoped>
.logo-text {
  height: 38px;
  div {
    font-size: 32px;
    font-weight: 500;
  }
}

.wallet-img {
  max-height: 140px;
  max-width: 100px;
}
</style>
