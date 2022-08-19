<template>
  <v-container class="mew-component--partners px-sm-15 py-15 py-md-12 mb-md-10">
    <div class="mew-heading-3 text-uppercase textMedium--text mb-7 text-center">
      {{ $t('aboutUs.partners') }}
    </div>

    <v-row>
      <v-col
        v-for="(p, key) in partners"
        :key="key"
        cols="6"
        sm="4"
        md="3"
        lg="2"
        class="text-center"
      >
        <a :href="p.link" target="_blank">
          <img
            :src="p.img"
            :height="$vuetify.breakpoint.mdAndUp ? '62' : '50'"
            alt="Partner"
          />
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
        img: require('@/assets/images/partners/rivet.png'),
        link: 'https://rivet.cloud/'
      }
    ]
  })
};
</script>
