<template>
  <b-modal ref="networkAndAddress" hide-footer class="bootstrap-modal modal-network-and-address"
           title="Network and Address">
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t('accessWallet.hdDerivationPath') }}</h4>
        <div class="dropdown-button-container">
          <b-dropdown id="hd-derivation-path" :text="selecteDPath.dpath" class="dropdown-button-1">
            <b-dropdown-item :class="selecteDPath.dpath === val.dpath ? 'active' : ''"
                             v-for="(val, key) in availablePaths"
                             @click="selectDPath(key)"
                             :key="key">
              {{val.dpath}}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="showCustomPathInput" ref="addCustomPath">{{
                                                                              $t('accessWallet.customPath')
                                                                              }}
            </b-dropdown-item>
            <b-dropdown-item ref="addCustomPathInput"><input></b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p class="derivation-brands">{{selecteDPath.label}}</p>
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
import {
  paths,
  ledger,
  trezor,
  getDerivationPath
} from '@/helpers/web3-overide/hardware/deterministicWalletPaths'

const unit = require('ethjs-unit')

export default {
  props: ['hardwareWallet'],
  data () {
    return {
      offset: 0,
      count: 5,
      hardwareAddresses: [],
      availablePaths: {},
      selecteDPath: '',
      customPathInput: false
    }
  },
  mounted () {
    this.selecteDPath = getDerivationPath(this.$store.state.network.type.name, this.hardwareWallet.brand)
    if (this.hardwareWallet.brand === 'ledger') {
      this.availablePaths = {
        ...paths,
        ...ledger
      }
    } else if (this.hardwareWallet.brand === 'trezor') {
      this.availablePaths = {
        ...paths,
        ...trezor
      }
    } else {
      this.availablePaths = {
        ...paths
      }
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
    showCustomPathInput (e) {
      console.log(e.target) // todo remove dev item
    },
    selectDPath (key) {
      this.selecteDPath = this.availablePaths[key]
      this.hardwareWallet.changeDPath(this.availablePaths[key].dpath)
        .then(() => {
          this.getAddresses()
            .then(addressSet => {
              this.hardwareAddresses = addressSet
            })
        })
        .catch(_error => {
          console.error(_error)
        })
    },
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
    getAddresses (count = 5, offset = 0) {
      return new Promise((resolve, reject) => {
        if ((this.offset + this.count) >= this.hardwareAddresses.length) {
          const web3 = this.$store.state.web3
          let hardwareAddresses = []
          this.hardwareWallet.getMultipleAccounts(count, offset)
            .then(_accounts => {
              console.log('_accounts', _accounts) // todo remove dev item
              Object.values(_accounts).forEach(async (address, i) => {
                console.log(address) // todo remove dev item
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
