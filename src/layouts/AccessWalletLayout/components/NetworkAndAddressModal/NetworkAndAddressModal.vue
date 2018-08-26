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
              }}</b-dropdown-item>
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
        <span @click="priorAddressSet">&lt; {{ $t('common.previous') }}</span>
        <span @click="nextAddressSet">{{ $t('common.next') }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container">{{ $t('accessWallet.acceptTerms') }} <a href="/">{{
        $t('common.terms')
        }}</a>.
        <input v-on:click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" type="checkbox"/>
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
      offset: 0,
      count: 5,
      hardwareAddresses: [],
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
      this.accessMyWalletBtnDisabled = true
      this.walletUnlocked = false
      this.offset = 0
      this.count = 5
      this.hardwareAddresses = []
      this.availablePaths = {}
      this.selecteDPath = ''
      this.invalidPath = ''
      this.customPathInput = false
      this.customPath = {label: '', dpath: ''}
    })
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
    unselectAllAddresses: function (e) {
      const selected = e.srcElement.parentElement.dataset.address
        ? e.srcElement.parentElement.dataset.address
        : e.srcElement.id
      document.querySelectorAll('.user-input-checkbox input').forEach(function (el) {
        el.checked = el.id === selected
      })
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
        console.log(this.customPath.dpath) // todo remove dev item
        // TODO: add indication of an invalid path
      }
    },
    selectDPath (key) {
      this.customPathInput = false
      this.hardwareWallet.changeDerivationPath(this.availablePaths[key].dpath)
        .then(() => {
          this.selecteDPath = this.availablePaths[key]
          this.invalidPath = ''
          this.getAddresses()
            .then(addressSet => {
              this.hardwareAddresses = addressSet
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
              Object.values(_accounts).forEach(async (address, i) => {
                const rawBalance = await this.$store.state.web3.eth.getBalance(address) // <- Throws because network (web3) not yet initialized
                const balance = unit.fromWei(web3.utils.toBN(rawBalance).toString(), 'ether')
                hardwareAddresses.push({index: i, address, balance})
              })
              resolve(hardwareAddresses)
            })
        }
      })
    },
    getPaths () {
      console.log(this.hardwareWallet)
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
          this.hardwareAddresses = addressSet
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "NetworkAndAddressModal.scss";
</style>
