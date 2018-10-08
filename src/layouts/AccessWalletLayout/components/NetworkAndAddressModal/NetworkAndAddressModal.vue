<template>
  <b-modal
    ref="networkAndAddress"
    :title="$t('accessWallet.networkAndAddress')"
    hide-footer
    class="bootstrap-modal padding-25-20 modal-network-and-address"
    centered>
    <!-- Derivation Path Drop down-->
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t('accessWallet.hdDerivationPath') }}</h4>
        <p>Jaxx, Metamask, Exodus, imToken, Trezor(ETH) & Digital Bitbox</p>
        <div class="dropdown-button-container">
          <b-dropdown
            id="hd-derivation-path"
            :text="selecteDPath.dpath"
            class="dropdown-button-2">
            <b-dropdown-item
              v-for="(val, key) in availablePaths"
              :class="selecteDPath.dpath === val.dpath ? 'active' : ''"
              :key="'base' + key"
              @click="selectDPath(key)">
              {{ val.dpath }}
            </b-dropdown-item>
            <b-dropdown-divider/>
            <b-dropdown-item>
              {{ $t('accessWallet.customPaths') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(val, key) in customPaths"
              :class="selecteDPath.dpath === val.dpath ? 'active' : ''"
              :key="key"
              @click="selectDPath(key)">
              {{ val.dpath }}
            </b-dropdown-item>
            <b-dropdown-item @click="showCustomPathInput">
              {{ $t('accessWallet.addCustomPath') }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p
        v-show="invalidPath !== ''"
        class="error-message-container">
        The path {{ invalidPath }} is not valid for this device
      </p>
      <p
        v-show="!customPathInput"
        class="derivation-brands">{{ selecteDPath.label }}</p>
      <div v-show="customPathInput">
        <!-- TODO: how to structure the path input? -->
        <input
          id="customPathLabel"
          v-model="customPath.label"
          placeholder="my custom path">
        <br>
        <input
          id="customPathInput"
          v-model="customPath.dpath"
          placeholder="m/44'/1'/0'/0">
        <br>
        <button @click="addCustomPath">addCustomPath</button>
        <button @click="showCustomPathInput">cancel</button>
      </div>
    </div>
    <!-- Address List -->
    <div class="content-container-2">
      <div class="address-block-container">
        <div class="block-title">
          <h4>{{ $t('accessWallet.interactAddr') }}</h4>
        </div>

        <ul class="address-block table-header">
          <li>{{ $t('accessWallet.id') }}</li>
          <li>{{ $t('common.address') }}</li>
          <li>{{ $t('common.balance') }}</li>
          <li/>
        </ul>

        <ul
          v-for="(details, index) in orderedAddresses"
          :data-address="'address' + index"
          :key="index"
          :class="selectedId === 'address' + index ? 'selected' : ''"
          class="address-block address-data"
          @click="setAddress(details, 'address' + index)">
          <li>{{ details.index + 1 }}.</li>
          <li>{{ details.address }}</li>
          <li>{{ details.balance }} ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input
                :id="'address' + index"
                type="checkbox"
                @click="unselectAllAddresses">
              <span class="checkmark checkmark-small"/>
            </label>
          </li>
        </ul>

      </div> <!-- .address-block-container -->

      <div class="address-nav">
        <span
          v-show="!connectionActive"
          @click="priorAddressSet()">&lt; {{ $t('common.previous') }}</span>
        <span
          v-show="!connectionActive"
          @click="nextAddressSet()">{{ $t('common.next') }} &gt;</span>
        <!-- Probably will need to restructure a bit to allow back browsing while new addresses are retrieved-->
        <span
          v-show="connectionActive"
          class="activeConn">&lt; {{ $t('common.previous') }}</span>
        <span
          v-show="connectionActive"
          class="activeConn">{{ $t('common.next') }} &gt;</span>
      </div>
    </div> <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container">{{ $t('accessWallet.acceptTerms') }}
        <a href="/">{{ $t('common.terms') }}</a>.
        <input
          ref="accessMyWalletBtn"
          type="checkbox"
          @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled">
        <span class="checkmark"/>
      </label>
    </div>
    <div class="button-container">
      <b-btn
        :disabled="accessMyWalletBtnDisabled"
        class="mid-round-button-green-filled close-button"
        @click.prevent="unlockWallet">
        {{ $t("common.accessMyWallet") }}
      </b-btn>
    </div>
    <customer-support/>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import * as unit from 'ethjs-unit';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  props: {
    hardwareWallet: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      selectedId: '',
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
      customPath: { label: '', dpath: '' }
    };
  },
  computed: {
    orderedAddresses() {
      const addressSet = [...this.displayAddresses];
      addressSet.sort(this.comparator);
      return addressSet.sort(this.comparator);
    }
  },
  watch: {
    hardwareWallet() {
      this.getPaths();
      this.getAddresses(this.count, this.offset).then(addressSet => {
        this.displayAddresses = addressSet;
      });
    }
  },
  mounted() {
    // reset component values when modal becomes hidden
    this.$refs.networkAndAddress.$on('hidden', () => {
      this.$refs.accessMyWalletBtn.checked = false;
      this.accessMyWalletBtnDisabled = true;
      this.walletUnlocked = false;
      this.availablePaths = {};
      this.selecteDPath = '';
      this.invalidPath = '';
      this.customPathInput = false;
      this.customPath = { label: '', dpath: '' };
      this.resetPaginationValues();
    });
  },
  methods: {
    comparator(a, b) {
      a = a.index + 1;
      b = b.index + 1;
      return a < b ? -1 : a > b ? 1 : 0;
    },
    unselectAllAddresses: function(selected) {
      document
        .querySelectorAll('.user-input-checkbox input')
        .forEach(function(el) {
          el.checked = el.id === selected;
        });
    },
    resetPaginationValues() {
      this.offset = 0;
      this.count = 5;
      this.currentIndex = 0;
      this.maxIndex = 0;
      this.displayAddresses = [];
      this.hardwareAddresses = [];
    },
    showCustomPathInput() {
      this.customPath = { label: '', dpath: '' };
      this.customPathInput = !this.customPathInput;
    },
    addCustomPath() {
      // TODO: figure out a more precise regex
      // eslint-disable-next-line no-useless-escape
      const regExp = /^\w+\/\d+'\/\d+'\/\d+'/;
      if (regExp.test(this.customPath.dpath)) {
        this.$store.dispatch('addCustomPath', this.customPath).then(() => {
          this.getPaths();
        });
        this.showCustomPathInput(); // reset the path input
      } else {
        // TODO: add indication of an invalid path
      }
    },
    selectDPath(key) {
      // rectify with content above
      this.customPathInput = false;
      this.resetPaginationValues();
      this.hardwareWallet
        .changeDerivationPath(this.availablePaths[key].dpath)
        .then(() => {
          this.selecteDPath = this.availablePaths[key];
          this.invalidPath = '';
          this.getAddresses().then(addressSet => {
            this.displayAddresses = addressSet;
          });
        })
        .catch(_error => {
          // If not a valid path Inform the user
          this.invalidPath = this.availablePaths[key].dpath;
          // eslint-disable-next-line no-console
          console.error(_error);
        });
    },
    unlockWallet() {
      this.$store.dispatch('decryptWallet', this.hardwareWallet);
      this.$router.push({ path: 'interface' });
    },
    setAddress(details, element) {
      this.selectedId = element;
      this.unselectAllAddresses(element);
      this.hardwareWallet.setActiveAddress(details.address, details.index);
    },
    priorAddressSet() {
      this.selectedId = '';
      if (this.currentIndex - this.count > 0) {
        this.currentIndex = this.currentIndex - this.count;
        this.displayAddresses = this.hardwareAddresses.slice(
          this.currentIndex - this.count,
          this.currentIndex
        );
      } else {
        this.offset = 0;
        this.currentIndex = 0;
        this.displayAddresses = this.hardwareAddresses.slice(0, 5);
      }
    },
    nextAddressSet() {
      this.selectedId = '';
      if (this.currentIndex + this.count < this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count;
        this.displayAddresses = this.hardwareAddresses.slice(
          this.currentIndex,
          this.currentIndex + this.count
        );
      } else if (this.currentIndex + this.count === this.maxIndex) {
        this.currentIndex = this.currentIndex + this.count;
        this.getAddresses(this.count, this.currentIndex).then(addressSet => {
          this.displayAddresses = addressSet;
        });
      } else {
        this.getAddresses(this.count, this.currentIndex).then(addressSet => {
          this.displayAddresses = addressSet;
        });
      }
    },
    getAddresses(count = 5, offset = 0) {
      return new Promise((resolve, reject) => {
        if (offset + count > this.maxIndex) {
          this.connectionActive = !this.connectionActive;
          const web3 = this.$store.state.web3;
          const hardwareAddresses = [];
          this.hardwareWallet
            .getMultipleAccounts(count, offset)
            .then(_accounts => {
              Object.values(_accounts).forEach(async (address, i) => {
                const rawBalance = await this.$store.state.web3.eth.getBalance(
                  address
                );
                const balance = unit.fromWei(
                  web3.utils.toBN(rawBalance).toString(),
                  'ether'
                );
                hardwareAddresses.push({ index: offset + i, address, balance });
                this.hardwareAddresses.push({
                  index: offset + i,
                  address,
                  balance
                });
              });
              this.maxIndex = offset + count;
              this.currentIndex = offset + count;
              this.connectionActive = !this.connectionActive;
              resolve(hardwareAddresses);
            })
            .catch(error => {
              // eslint-disable-next-line no-console
              console.error(error);
              reject(error);
            });
        }
      });
    },
    getPaths() {
      this.selecteDPath = this.hardwareWallet.getDerivationPath();
      // nodes
      this.availablePaths = {
        ...this.hardwareWallet.compatibleChains
      };
      this.customPaths = {
        ...this.$store.state.customPaths
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NetworkAndAddressModal-desktop.scss';
@import 'NetworkAndAddressModal-tablet.scss';
@import 'NetworkAndAddressModal-mobile.scss';

.activeConn {
  color: gray;
}
</style>
