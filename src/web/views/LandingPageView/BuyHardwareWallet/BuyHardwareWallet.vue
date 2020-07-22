<template>
  <div class="bg_blue">
    <BlockTitle :data="titleData" />

    <v-sheet color="transparent" max-width="1000px" class="mx-auto">
      <v-row>
        <v-col v-for="(b, key) in buttons" :key="key" cols="6">
          <a :href="b.link" target="_blank">
            <mew-super-button
              :title="b.currency + b.price"
              :subtitle="b.note"
              tag="Learn more"
              :right-icon="b.walletImg"
              icon-type="img"
            />
          </a>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  name: 'HowItWorks',
  components: { BlockTitle },
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
</style>
