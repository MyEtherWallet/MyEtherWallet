<template>
  <div class="transaction-tokens">
    <div class="wrap">
      <div class="tokens-container">
        <div class="token-search">
          <div class="block-title">
            <h4>{{ $t('interface.tokens') }}</h4>
            <p>+ {{ $t('interface.customToken') }}</p>
          </div>
          <div class="search-block">
            <input v-model="search" placeholder="Search"/>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        <div class="token-table-container" ref="tokenTableContainer">
          <table v-show="localTokens.length > 0">
            <tr v-for="(token, index) in localTokens" :key="token.name + index">
              <td>{{token.name}}</td>
              <td>{{token.balance}}</td>
            </tr>
          </table>
          <div class="spinner-container" v-show="search === '' && localTokens.length === 0 && receivedTokens">
            <i class="fa fa-spinner fa-spin"></i>
          </div>
          <div class="spinner-container" v-show="localTokens.length === 0 && !receivedTokens">
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
export default {
  props: ['tokens', 'receivedTokens'],
  data () {
    return {
      search: '',
      localTokens: []
    }
  },
  mounted () {
    this.assignTokens(this.tokens)
  },
  methods: {
    tokenListExpend () {
      this.$refs.tokenTableContainer.classList.toggle('expanded')
      this.$refs.expendDown.classList.toggle('hidden')
      this.$refs.expendUp.classList.toggle('hidden')
    },
    assignTokens (arr) {
      if (this.search !== '') {
        this.localTokens = this.tokens.filter(token => {
          if (token.name.toLowerCase().includes(this.search.toLowerCase())) {
            return token
          }
        })
      } else {
        this.localTokens = arr
      }
    }
  },
  watch: {
    tokens (newVal) {
      this.assignTokens(newVal)
    },
    search (newVal) {
      if (newVal !== '') {
        this.localTokens = this.tokens.filter(token => {
          if (token.name.toLowerCase().includes(newVal.toLowerCase())) {
            return token
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "InterfaceTokens.scss";
</style>
