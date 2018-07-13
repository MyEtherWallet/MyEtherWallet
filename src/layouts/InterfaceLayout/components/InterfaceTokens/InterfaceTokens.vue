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
        <div class="token-table-container" ref="tokenTableContainer">
          <table v-show="tokens.length > 0">
            <tr v-for="(token, index) in tokens" :key="token.name + index">
              <td>{{token.name}}</td>
              <td>{{token.balance}}</td>
            </tr>
          </table>
          <div class="spinner-container" v-show="tokens.length === 0 && receivedTokens">
            <i class="fa fa-spinner fa-spin"></i>
          </div>
          <div class="spinner-container" v-show="tokens.length === 0 && !receivedTokens">
            No tokens found :(
          </div>
        </div>
        <div v-on:click="tokenListExpend" class="expend-bar">
          <p class="down" ref="expendDown"><i class="fa fa-angle-double-down" aria-hidden="true"></i></p>
          <p class="up hidden" ref="expendUp"><i class="fa fa-angle-double-up" aria-hidden="true"></i></p>
        </div>
      </div>
      <div class="bottom-image-container">
        <img class="icon" src="~@/assets/images/etc/mewconnectad.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { parseTokensHex } from '@/helpers'
export default {
  data () {
    return {
      tokens: [],
      receivedTokens: false
    }
  },
  methods: {
    tokenListExpend () {
      this.$refs.tokenTableContainer.classList.toggle('expanded')
      this.$refs.expendDown.classList.toggle('hidden')
      this.$refs.expendUp.classList.toggle('hidden')
    },
    async fetchTokens () {
      if (this.$store.state.network.type.name === 'ETH') {
        this.receivedTokens = true
        const toAddress = '0xBE1ecF8e340F13071761e0EeF054d9A511e1Cb56'
        const userAddress = this.$store.state.wallet
          .getAddress()
          .toString('hex')
        const data = `0x80f4ae5c000000000000000000000000${userAddress}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000`

        const body = {
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [{ to: toAddress, data: data }, 'pending'],
          id: 0
        }

        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }

        const response = await fetch(this.$store.state.network.url, config)
          .then(res => {
            return res.json()
          })
          .catch(err => {
            console.log(err)
          })
        return response
      } else {
        this.receivedTokens = false
        return this.$store.state.network.type.tokens
      }
    },
    search (str) {
      return this.tokens.filter(item => {
        if (str !== '' && item.name.includes(str)) {
          return item
        } else {
          return item
        }
      })
    },
    async setTokens () {
      const hex = await this.fetchTokens()
      if (this.tokens.length > 0) {
        this.tokens = parseTokensHex(hex.result).sort((a, b) => {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1
          } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1
          } else {
            return 0
          }
        })
      }
    }
  },
  mounted () {
    if (this.$store.state.online) {
      this.setTokens()
    }
  },
  watch: {
    tokens (newVal) {
      this.tokens = newVal
    },
    network (newVal) {
      this.setTokens()
    }
  },
  computed: {
    ...mapGetters({
      network: 'network'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "InterfaceTokens.scss";
</style>
