<template>
  <div class="expandHeader pb-12">
    <v-container>
      <the-layout-header
        title="Get a hardware wallet today!"
        subtitle-line-one="The Hardware wallet offer the highest security for accessing your crypto."
      />
      <v-sheet
        color="transparent"
        :max-width="!$vuetify.breakpoint.smAndDown ? '900px' : '470px'"
        class="mx-auto"
      >
        <v-row>
          <v-col v-for="(b, key) in buttons" :key="key" cols="12" md="6">
            <a :href="b.link" target="_blank">
              <v-card
                height="100%"
                color="white"
                class="
                  btn-custom
                  border-radius--10px
                  pa-8 pa-md-10
                  d-flex
                  align-center
                  justify-space-between
                "
              >
                <div>
                  <v-img
                    v-if="b.logoImg"
                    max-height="30px"
                    max-width="120px"
                    :src="b.logoImg"
                    alt="Hardware wallet"
                    class="mb-3"
                  />
                  <div
                    v-if="b.logoText"
                    class="d-flex align-center mb-3"
                    :class="
                      !$vuetify.breakpoint.smAndDown
                        ? 'mew-subtitle'
                        : 'mew-heading-2'
                    "
                  >
                    {{ b.logoText }}
                  </div>
                  <div
                    class="
                      mew-caption
                      text-uppercase
                      font-weight-bold
                      primary--text
                      text--lighten-1
                    "
                  >
                    {{ b.priceNote }}
                  </div>

                  <div class="d-flex">
                    <div class="mew-caption mr-1 font-weight-black">
                      {{ b.currency }}
                    </div>
                    <div class="mew-heading-2 text-uppercase font-weight-bold">
                      {{ b.price }}
                    </div>
                  </div>
                  <div>
                    {{ b.note }}
                  </div>
                  <div class="mt-3 primary--text font-weight-medium">
                    Learn more >
                  </div>
                </div>

                <div v-if="!$vuetify.breakpoint.xs" class="pl-4">
                  <v-img
                    :src="b.walletImg"
                    alt="Hardware Wallet"
                    max-width="90px"
                    max-height="110px"
                    contain
                  />
                </div>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';

export default {
  name: 'TheBuyHardwareWalletLayout',
  components: { TheLayoutHeader },
  data: () => ({
    buttons: [
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-ledger.svg'),
        walletImg: require('@/assets/images/hardware-wallets/ledger.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '59.00',
        note: 'Easy to carry everywhere thanks to its USB format.',
        link: 'https://shop.ledger.com/?r=fa4b'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/trezor.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://trezor.io/?offer_id=12&aff_id=2029'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-keepkey.png'),
        walletImg: require('@/assets/images/hardware-wallets/keepkey.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://keepkey.myshopify.com/?afmc=pi&utm_campaign=pi&utm_source=leaddyno&utm_medium=affiliate'
      },
      {
        logoText: 'BitBox',
        //logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/bitbox.png'),
        priceNote: 'Starting from',
        currency: '$',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://shiftcrypto.ch/'
      },
      {
        logoText: 'ETHER.CARDS',
        //logoImg: require('@/assets/images/hardware-wallets/logo-ethercards.png'),
        walletImg: require('@/assets/images/hardware-wallets/bitmap.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://ether.cards/?utm_source=mew&utm_medium=cpm&utm_campaign=site'
      },
      {
        logoText: 'FINNEY',
        //logoImg: require('@/assets/images/hardware-wallets/logo-trezor.svg'),
        walletImg: require('@/assets/images/hardware-wallets/finney.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'The most trusted hardware wallet in the world. Get yours today!',
        link: 'https://shop.sirinlabs.com/?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf'
      },
      {
        logoImg: require('@/assets/images/hardware-wallets/logo-billfodl.png'),
        walletImg: require('@/assets/images/hardware-wallets/billfodl.png'),
        priceNote: 'Starting from',
        currency: '€',
        price: '83.26',
        note: 'Unmatched physical security for your private keys.',
        link: 'https://privacypros.io/?afmc=2j&utm_campaign=2j&utm_source=leaddyno&utm_medium=affiliate'
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
.btn-custom {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(11, 40, 64);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
  }

  &:hover::before {
    opacity: 0.08;
  }
}
</style>
