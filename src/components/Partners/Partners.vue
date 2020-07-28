<template>
  <div class="home-partners">
    <v-container>
      <div class="flex-column d-flex">
        <span class="mew-heading-3 text-uppercase textPrimary--text pb-3">
          Partners
        </span>
        <span class="mew-subtitle pb-7">
          Connect with the powerful crypto communities
        </span>
      </div>
      <v-row class="mt-8 px-4">
        <v-col v-for="(p, key) in partners" :key="key" cols="3" md="3" lg="2">
          <a :href="p.link" target="_blank">
            <img :src="p.img" />
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomePartners',
  components: {},
  data: () => ({
    partners: [
      {
        img: require('@/assets/images/partners/ledger.png'),
        href: 'https://www.ledger.com/?r=fa4b'
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
      }
    ]
  })
};
</script>
