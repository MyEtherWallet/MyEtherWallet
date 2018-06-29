<template>
  <div class="transaction-tokens">
    <div class="wrap">
      <div class="tokens-container">
        <div class="token-search">
          <div class="block-title">
            <h4>{{ $t('interface.tokens') }}</h4>
            <p>+ {{ $t('interface.customToken') }}</p>
          </div>
          <div class="search-block dropdown-select-search-1">
            <v-select :options="['foo', 'bar']"></v-select>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        <div class="token-table-container">
          <table v-show="tokens.length > 0">
            <tr v-for="(token, index) in tokens" :key="token.name + index">
              <td>{{token.name}}</td>
              <td>{{token.balance}}</td>
            </tr>
          </table>
          <div class="spinner-container" v-show="tokens.length === 0">
            <i class="fa fa-spinner fa-spin"></i>
          </div>
        </div>
        <div v-on:click="tokenListExpend" class="expend-bar">
          <p class="down"><i class="fa fa-angle-double-down" aria-hidden="true"></i></p>
          <p class="up hidden"><i class="fa fa-angle-double-up" aria-hidden="true"></i></p>
        </div>
      </div> <!-- .tokens-container -->
      <div class="bottom-image-container">
        <img class="icon" src="~@/assets/images/etc/oiwjehfowhohweg.png">
      </div>
    </div><!-- .wrap -->
  </div>
</template>

<script>
import {parseTokensHex} from '@/helpers'
export default {
  data () {
    return {
      tokens: []
    }
  },
  methods: {
    tokenListExpend: function () {
      document.querySelector('.token-table-container').classList.toggle('expended')
      document.querySelector('.expend-bar .down').classList.toggle('hidden')
      document.querySelector('.expend-bar .up').classList.toggle('hidden')
    },
    fetchTokens: async function () {
      const toAddress = '0xBE1ecF8e340F13071761e0EeF054d9A511e1Cb56'
      const userAddress = this.$store.state.wallet.getAddress().toString('hex')
      const data = `0x80f4ae5c000000000000000000000000${userAddress}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000`
      const node = 'https://api.myetherwallet.com/eth'

      const body = {
        'jsonrpc': '2.0',
        'method': 'eth_call',
        'params': [{to: toAddress, data: data}, 'pending'],
        'id': 0
      }

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      const response = await fetch(node, config).then((res) => {
        return res.json()
      }).catch((err) => {
        console.log(err)
      })

      return response
    },
    search: function (str) {
      return this.tokens.filter(item => {
        if (str !== '' && item.name.includes(str)) {
          return item
        } else {
          return item
        }
      })
    }
  },
  mounted: async function () {
    const hex = await this.fetchTokens()
    this.tokens = parseTokensHex(hex.result).sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1
      } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1
      } else {
        return 0
      }
    })
  },
  watch: {
    tokens: function (newVal) {
      this.tokens = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceTokens.scss";
</style>
