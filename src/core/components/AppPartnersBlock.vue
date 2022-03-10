<template>
  <v-container class="mew-component--partners py-7 py-md-12 mb-6">
    <v-sheet color="transparent" align="center">
      <div class="mew-heading-3 text-uppercase textMedium--text mb-1">
        Partners
      </div>
    </v-sheet>
    <v-row class="mt-2 px-4" align="center">
      <v-col
        v-for="(p, key) in partners"
        :key="key"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <a :href="p.link" target="_blank">
          <img :src="p.img" style="width: 90%; max-width: 120px" />
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AppPartnersBlock',
  components: {},
  data: () => ({
    partners: [
      {
        img: require('@/assets/images/partners/ledger.png'),
        link: 'https://www.ledger.com/?r=fa4b'
      },
      {
        img: require('@/assets/images/partners/trezor.png'),
        link: 'https://trezor.io/?offer_id=12&aff_id=2029'
      },
      {
        img: require('@/assets/images/partners/bitbox.png'),
        link: 'https://shiftcrypto.ch/?ref=mew'
      },
      {
        img: require('@/assets/images/partners/secalot.png'),
        link: 'https://www.secalot.com/'
      },
      {
        img: require('@/assets/images/partners/bity.png'),
        link: 'https://bity.com/af/jshkb37v'
      },
      {
        img: require('@/assets/images/partners/sirin.png'),
        link: 'https://sirinlabs.com/'
      },
      {
        img: require('@/assets/images/partners/keepkey.png'),
        link: 'http://lddy.no/a4im'
      },
      {
        img: require('@/assets/images/partners/kyber.png'),
        link: 'https://kyber.network/'
      },
      {
        img: require('@/assets/images/partners/changelly.png'),
        link: 'https://changelly.com/'
      },
      {
        img: require('@/assets/images/partners/simplex.png'),
        link: 'https://www.simplex.com/'
      },
      {
        img: require('@/assets/images/partners/1inchdark.png'),
        link: 'https://app.1inch.io/'
      },
      {
        img: require('@/assets/images/partners/dexag.png'),
        link: 'https://dex.ag/'
      }
    ]
  })
};
</script>
