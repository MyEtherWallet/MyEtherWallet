<template>
  <b-modal ref="networkAndAddress" hide-footer class="bootstrap-modal modal-network-and-address"
           title="Network and Address">
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t('accessWallet.hdDerivationPath') }}</h4>
        <div class="dropdown-button-container">
          <b-dropdown id="hd-derivation-path" text="m/44’/60’/0’/0" class="dropdown-button-1">
            <b-dropdown-item class="active">m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-item>m/44’/60’/0’/0</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>{{ $t('accessWallet.customPath') }}</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p class="derivation-brands">Jaxx, Metamask, Exodus, imToken, Trezor(ETH) & Digital Bitbox</p>
    </div>
    <div class="content-container-2">
      <div class="address-block-container">
        <div class="block-title">
          <h4>{{ $t('accessWallet.interactAddr') }}</h4>
        </div>

        <ul class="address-block table-header">
          <li>{{ $t('accessWallet.id') }}</li>
          <li>{{ $t('common.address') }}</li>
          <li>{{ $t('common.balance') }}</li>
          <li></li>
        </ul>

        <ul class="address-block address-data" v-for="(details, index) in orderedAddresses"
            v-bind:key="index">
          <li>{{details.index + 1}}.</li>
          <li>{{details.address}}</li>
          <li>{{details.balance}} ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input type="checkbox"/>
              <span class="checkmark checkmark-small" @click="setAddress(details)"></span>
            </label>
          </li>
        </ul>

      </div> <!-- .address-block-container -->

      <div class="address-nav">
        <span @click="priorAddressSet">&lt; {{ $t('common.previous') }}</span>
        <span @click="nextAddressSet">{{ $t('common.next') }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container">{{ $t('accessWallet.acceptTerms') }} <a href="/">{{
                                                                                         $t('common.terms')
                                                                                         }}</a>.
        <input type="checkbox"/>
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="button-container">
      <b-btn @click.prevent="unlockWallet" class="mid-round-button-green-filled close-button">
        {{ $t('common.continue') }}
      </b-btn>
    </div>
    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t('common.customerSupport') }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
const unit = require('ethjs-unit')

export default {
  props: ['hardwareWallet'],
  data () {
    return {
      offset: 0,
      count: 5,
      hardwareAddresses: []
    }
  },
  computed: {
    orderedAddresses () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.hardwareAddresses.sort((a, b) => {
        a = (a.index + 1)
        b = (b.index + 1)
        return a < b ? -1 : a > b ? 1 : 0
      }).slice(this.offset, this.count)
    }
  },
  methods: {
    unlockWallet () {
      this.$store.dispatch('decryptWallet', this.hardwareWallet)
      this.$router.push({path: 'interface'})
    },
    setAddress (details) {
      this.hardwareWallet.setActiveAddress(details.address, details.index)
    },
    priorAddressSet () {
      if (this.offset - this.count >= 0) {
        this.offset = this.offset - this.count
      } else {
        this.offset = 0
      }
    },
    nextAddressSet () {
      this.offset = this.count + 1
      this.getAddresses(this.count, this.offset)
        .then(addressSet => {
          this.hardwareAddresses = [...this.hardwareAddresses, ...addressSet]
        })
    },
    getAddresses (count, offset) {
      return new Promise((resolve, reject) => {
        if ((this.offset + this.count) >= this.hardwareAddresses.length) {
          const web3 = this.$store.state.web3
          let hardwareAddresses = []
          this.hardwareWallet.getMultipleAccounts(count, offset)
            .then(_accounts => {
              console.log('_accounts', _accounts) // todo remove dev item
              Object.values(_accounts).forEach(async (address, i) => {
                const rawBalance = await this.$store.state.web3.eth.getBalance(address)
                const balance = unit.fromWei(web3.utils.toBN(rawBalance).toString(), 'ether')
                hardwareAddresses.push({index: i, address, balance})
              })
              resolve(hardwareAddresses)
            })
        }
      })
    }
  },
  watch: {
    hardwareWallet (newValue) {
      this.getAddresses(this.count, this.offset)
        .then(addressSet => {
          this.hardwareAddresses = addressSet
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NetworkAndAddressModal.scss";
</style>
