<template>
  <div>
    <div class="desktop-content d-none d-lg-block">
      <div class="py-12" />
      <v-container>
        <v-sheet color="transparent" max-width="400px">
          <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
            Partners
          </div>
          <h2 class="font-weight--700 mb-9">
            Connect with the powerful crypto communities
          </h2>
        </v-sheet>
        <v-row class="mt-8 px-4">
          <v-col v-for="(p, key) in partners" :key="key" cols="3" md="3" lg="2">
            <a :href="p.link" target="_blank">
              <img :src="p.img" />
            </a>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <v-sheet color="transparent" max-width="400px" class="mb-4">
            <h5 class="font-weight-bold text-uppercase textPrimary--text mb-2">
              Partners
            </h5>
            <h1 class="font-weight--700">
              Connect with the powerful crypto communities
            </h1>
          </v-sheet>

          <v-row class="px-2">
            <v-col v-for="(p, key) in partners" :key="key" cols="6" sm="4">
              <div class="d-flex align-center">
                <a :href="p.link" target="_blank">
                  <img :src="p.img" style="width: 90%; max-width: 120px" />
                </a>
              </div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-container>
      <div class="py-7" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Partners',
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
