<template>
  <div class="transaction-tokens">
    <interface-tokens-modal :addToken="addToken"></interface-tokens-modal>
    <div class="wrap">
      <div class="tokens-container">
        <div class="token-search">
          <div class="block-title">
            <h4>{{ $t('interface.tokens') }}</h4>
            <p @click="addTokenModal">+ {{ $t('interface.customToken') }}</p>
          </div>
          <div class="search-block">
            <input v-model="search" placeholder="Search" autocomplete="off"/>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        <div class="token-table-container" ref="tokenTableContainer">
          <table v-show="customTokens.length > 0">
            <tr v-for="(token, index) in customTokens" :key="token.name + index">
              <td>{{token.name}}</td>
              <td>{{token.balance}} <i class="fa fa-times-circle clickable" @click="removeToken(index)"></i></td>
            </tr>
          </table>
          <table v-show="localTokens.length > 0">
            <tr v-for="(token, index) in localTokens" :key="token.name + index">
              <td>{{token.name}}</td>
              <td>{{token.balance}}</td>
            </tr>
          </table>
          <div class="spinner-container" v-show="search === '' && localTokens.length === 0 && receivedTokens">
            <i class="fa fa-spinner fa-spin"></i>
          </div>
          <div class="spinner-container" v-show="localTokens.length === 0 && customTokens.length === 0 && !receivedTokens">
            No tokens found :(
          </div>
        </div>
        <div v-on:click="tokenListExpend" class="expend-bar" v-if="customTokens.length < 10 || localTokens.length < 15">
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
import store from 'store'
import {mapGetters} from 'vuex'
import InterfaceTokensModal from '../InterfaceTokensModal'

export default {
  props: ['tokens', 'receivedTokens', 'getTokenBalance'],
  components: {
    'interface-tokens-modal': InterfaceTokensModal
  },
  data () {
    return {
      search: '',
      localTokens: [],
      customTokens: []
    }
  },
  mounted () {
    this.assignTokens(this.tokens, this.search)
  },
  methods: {
    addTokenModal () {
      this.$children[0].$refs.token.show()
    },
    removeToken (idx) {
      const storedTokens = store.get('customTokens')
      this.customTokens.splice(idx, 1)
      storedTokens[this.network.type.name] = this.customTokens
      store.set('customTokens', storedTokens)
    },
    async addToken (address, symbol, decimal) {
      const localStorageName = {}
      let newArray = []
      let balance = await this.getTokenBalance(address)
      const token = {
        addr: address,
        balance: balance,
        decimals: decimal,
        email: '',
        name: symbol,
        symbol: symbol,
        website: '',
        type: 'custom'
      }

      if (this.customTokens.length > 0) {
        newArray = this.customTokens.map(item => item)
      }
      newArray.push(token)
      this.customTokens = newArray
      localStorageName[this.network.type.name] = this.customTokens

      store.set('customTokens', localStorageName)
      this.$children[0].$refs.token.hide()
    },
    tokenListExpend () {
      this.$refs.tokenTableContainer.classList.toggle('expanded')
      this.$refs.expendDown.classList.toggle('hidden')
      this.$refs.expendUp.classList.toggle('hidden')
    },
    assignTokens (arr, query) {
      const oldArray = this.customTokens.slice()
      if (query !== '') {
        this.customTokens = oldArray.filter(token => {
          if (token.name.toLowerCase().includes(query.toLowerCase())) {
            return token
          }
        })
        this.localTokens = this.tokens.filter(token => {
          if (token.name.toLowerCase().includes(query.toLowerCase())) {
            return token
          }
        })
      } else {
        this.localTokens = arr
        if (store.get('customTokens') !== undefined && store.get('customTokens')[this.network.type.name] !== undefined) {
          this.customTokens = store.get('customTokens')[this.network.type.name]
        }
      }
    }
  },
  watch: {
    tokens (newVal) {
      this.assignTokens(newVal, this.search)
    },
    search (newVal) {
      this.assignTokens(this.tokens, newVal)
    },
    customTokens (newVal) {
      this.customTokens = newVal
    },
    network (newVal) {
      if (store.get('customTokens') !== undefined && store.get('customTokens')[newVal.type.name] !== undefined) {
        this.customTokens = store.get('customTokens')[newVal.type.name]
      } else {
        this.customTokens = []
      }
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
