<template>
  <div>
    <access-my-wallet-container></access-my-wallet-container>
    <price-bar :v-if="$store.getters.all.online && tokens.length > 1" :tokens="tokens"></price-bar>
    <faqs></faqs>
  </div>
</template>

<script>
export default {
  name: 'AccessWalletContainer',
  data () {
    return {
      tokens: []
    }
  },
  methods: {
    getRates: async function () {
      const rates = await fetch('http://still-waters-52916.herokuapp.com/ticker?filter=BTC,ETH,REP,KNC,OMG,EOS,XRP,BCH,LTC,TRX,NEO,ETC,QTUM,ADA,XMR,QTUM,SNT,ELF,BAT,ENG').then((res) => {
        return res.json()
      }).catch((err) => {
        return err
      })
      return Object.keys(rates.data).map(item => Object.assign(rates.data[item])).sort((a, b) => {
        if (a.rank < b.rank) return -1
        if (a.rank > b.rank) return 1
        return 0
      })
    }
  },
  mounted: async function () {
    const self = this
    if (this.$store.getters.all.online) {
      self.tokens = await self.getRates()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessWalletLayout.scss";
</style>
