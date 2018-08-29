<template>
  <b-modal ref="networkAndAddress" hide-footer class="bootstrap-modal modal-network-and-address"
           title="Network and Address" centered>
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t('accessWallet.hdDerivationPath') }}</h4>
        <div class="dropdown-button-container">
          <b-dropdown id="hd-derivation-path" :text="selecteDPath.dpath" class="dropdown-button-1">
            <b-dropdown-item :class="selecteDPath.dpath === val.dpath ? 'active' : ''"
                             v-for="(val, key) in availablePaths"
                             @click="selectDPath(key)"
                             :key="'base' + key">
              {{val.dpath}}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>{{
              $t('accessWallet.customPaths')
              }}
            </b-dropdown-item>
            <b-dropdown-item :class="selecteDPath.dpath === val.dpath ? 'active' : ''"
                             v-for="(val, key) in customPaths"
                             @click="selectDPath(key)"
                             :key="key">
              {{val.dpath}}
            </b-dropdown-item>
            <b-dropdown-item @click="showCustomPathInput">{{
              $t('accessWallet.customPath')
              }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p class="error-message-container" v-show="invalidPath !== ''">
        The path {{invalidPath}} is not valid for this device
      </p>
      <p class="derivation-brands" v-show="!customPathInput">{{selecteDPath.label}}</p>
      <div v-show="customPathInput">
        <!-- TODO: how to structure the path input? -->
        <input id="customPathLabel" v-model="customPath.label" placeholder="my custom path"/>
        <br/>
        <input id="customPathInput" v-model="customPath.dpath" placeholder="m/44'/1'/0'/0"/>
        <br/>
        <button @click="addCustomPath">addCustomPath</button>
        <button @click="showCustomPathInput">cancel</button>
      </div>
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
            v-bind:data-address="'address' + index"
            v-bind:key="index"
            @click="setAddress(details)"
            v-on:click="unselectAllAddresses">
          <li>{{details.index + 1}}.</li>
          <li>{{details.address}}</li>
          <li>{{details.balance}} ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input v-bind:id="'address' + index" v-on:click="unselectAllAddresses" type="checkbox"/>
              <span class="checkmark checkmark-small"></span>
            </label>
          </li>
        </ul>

      </div> <!-- .address-block-container -->

      <div class="address-nav">
        <span v-on:click="priorAddressSet()" v-show="!connectionActive">&lt; {{ $t('common.previous') }}</span>
        <span v-on:click="nextAddressSet()" v-show="!connectionActive">{{ $t('common.next') }} &gt;</span>
        <!-- Probably will need to restructure a bit to allow back browsing while new addresses are retrieved-->
        <span v-show="connectionActive" class="activeConn">&lt; {{ $t('common.previous') }}</span>
        <span v-show="connectionActive" class="activeConn">{{ $t('common.next') }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container">{{ $t('accessWallet.acceptTerms') }} <a href="/">{{
        $t('common.terms')
        }}</a>.
        <input ref="accessMyWalletBtn" v-on:click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" type="checkbox"/>
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="button-container">
      <b-btn @click.prevent="unlockWallet" class="mid-round-button-green-filled close-button"
             :disabled="accessMyWalletBtnDisabled">
        {{ $t("common.accessMyWallet") }}
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
      accessMyWalletBtnDisabled: true,
      walletUnlocked: false,
      connectionActive: false,
      offset: 0,
      count: 5,
      currentIndex: 0,
      maxIndex: 0,
      hardwareAddresses: [],
      displayAddresses: [],
      availablePaths: {},
      customPaths: {},
      selecteDPath: '',
      invalidPath: '',
      customPathInput: false,
      customPath: {label: '', dpath: ''}
    }
  },
  mounted () {
    // reset component values when modal becomes hidden
    this.$refs.networkAndAddress.$on('hidden', () => {
      this.$refs.accessMyWalletBtn.checked = false
      this.accessMyWalletBtnDisabled = true
      this.walletUnlocked = false
      this.availablePaths = {}
      this.selecteDPath = ''
      this.invalidPath = ''
      this.customPathInput = false
      this.customPath = {label: '', dpath: ''}
      this.resetPaginationValues()
    })
  },
  computed: {
    orderedAddresses () {
      let addressSet = [...this.displayAddresses]
      addressSet.sort(this.comparator)
      return addressSet.sort(this.comparator)
    }
  },
  methods: {
    comparator (a, b) {
      a = (a.index + 1)
      b = (b.index + 1)
      return a < b ? -1 : a > b ? 1 : 0
    },
    unselectAllAddresses: function (e) {
      const selected = e.srcElement.parentElement.dataset.address
        ? e.srcElement.parentElement.dataset.address
        : e.srcElement.id
      document.querySelectorAll('.user-input-checkbox input').forEach(function (el) {
        el.checked = el.id === selected
      })
    },
    resetPaginationValues () {
      this.offset = 0
      this.count = 5
      this.currentIndex = 0
      this.maxIndex = 0
      this.displayAddresses = []
      this.hardwareAddresses = []
    },
    showCustomPathInput (e) {
      this.customPath = {label: '', dpath: ''}
      this.customPathInput = !this.customPathInput
    },
    addCustomPath () {
      // TODO: figure out a more precise regex
      // eslint-disable-next-line no-useless-escape
      const regExp = /^\w+\/\d+'\/\d+'\/\d+'/
      if (regExp.test(this.customPath.dpath)) {
        this.$store.dispatch('addCustomPath', this.customPath)
          .then(() => {
            this.getPaths()
          })
        this.showCustomPathInput() // reset the path input
      } else {
        // TODO: add indication of an invalid path
      }
    },
    selectDPath (key) {
      // rectify with content above
      this.customPathInput = false
      this.resetPaginationValues()
      this.hardwareWallet.changeDerivationPath(this.availablePaths[key].dpath)
        .then(() => {
          this.selecteDPath = this.availablePaths[key]
          this.invalidPath = ''
          this.getAddresses()
            .then(addressSet => {
              this.displayAddresses = addressSet
            })
        })
        .catch(_error => {
          // If not a valid path Inform the user
          this.invalidPath = this.availablePaths[key].dpath
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
      if (this.currentIndex - this.count > 0) {
        this.currentIndex = this.currentIndex - this.count
        this.displayAddresses = this.hardwareAddresses.slice(this.currentIndex - this.count, this.currentIndex)
      } else {
        this.offset = 0
        this.currentIndex = 0
        this.displayAddresses = this.hardwareAddresses.slice(0, 5)
      }
    },
    nextAddressSet () {
      if (this.currentIndex + this.count < this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count
        this.displayAddresses = this.hardwareAddresses.slice(this.currentIndex, this.currentIndex + this.count)
      } else if (this.currentIndex + this.count === this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count
        this.getAddresses(this.count, this.currentIndex)
          .then(addressSet => {
            this.displayAddresses = addressSet
          })
      } else {
        this.getAddresses(this.count, this.currentIndex)
          .then(addressSet => {
            this.displayAddresses = addressSet
          })
      }
    },
    getAddresses (count = 5, offset = 0) {
      return new Promise((resolve, reject) => {
        if (offset + count > this.maxIndex) {
          this.connectionActive = !this.connectionActive
          const web3 = this.$store.state.web3
          let hardwareAddresses = []
          this.hardwareWallet.getMultipleAccounts(count, offset)
            .then(_accounts => {
              Object.values(_accounts).forEach(async (address, i) => {
                const rawBalance = await this.$store.state.web3.eth.getBalance(address)
                const balance = unit.fromWei(web3.utils.toBN(rawBalance).toString(), 'ether')
                hardwareAddresses.push({index: offset + i, address, balance})
                this.hardwareAddresses.push({index: offset + i, address, balance})
              })
              this.maxIndex = offset + count
              this.currentIndex = offset + count
              this.connectionActive = !this.connectionActive
              resolve(hardwareAddresses)
            })
            .catch(console.log)
        }
      })
    },
    getPaths () {
      this.selecteDPath = this.hardwareWallet.getDerivationPath()
      // nodes
      this.availablePaths = {
        ...this.hardwareWallet.compatibleChains
      }
      this.customPaths = {
        ...this.$store.state.customPaths
      }
    }
  },
  watch: {
    hardwareWallet (newValue) {
      this.getPaths()
      this.getAddresses(this.count, this.offset)
        .then(addressSet => {
          this.displayAddresses = addressSet
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NetworkAndAddressModal.scss";

  .activeConn {
    color: gray;
  }
</style>
