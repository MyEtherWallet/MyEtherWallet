<template>
  <b-modal
    ref="networkAndAddress"
    :title="$t('accessWallet.networkAndAddress')"
    hide-footer
    class="bootstrap-modal padding-25-20 modal-network-and-address"
    centered
  >
    <!-- Derivation Path Drop down -->
    <div class="content-container-1">
      <div class="hd-derivation">
        <h4>{{ $t('accessWallet.hdDerivationPath') }}</h4>
        <p>Jaxx, Metamask, Exodus, imToken, Trezor(ETH) & Digital Bitbox</p>
        <div class="dropdown-button-container">
          <b-dropdown
            id="hd-derivation-path"
            :text="selectedPath"
            class="dropdown-button-2"
          >
            <b-dropdown-item
              v-for="(val, key) in availablePaths"
              v-if="key !== 'default'"
              :class="selectedPath === val.path ? 'active' : ''"
              :key="'base' + key"
              @click="changePath(key);"
            >
              {{ val.path }}
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item>
              {{ $t('accessWallet.customPaths') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-for="(val, key) in customPaths"
              :class="selectedPath.dpath === val.dpath ? 'active' : ''"
              :key="key"
              @click="changePath(key);"
            >
              {{ val.dpath }}
            </b-dropdown-item>
            <b-dropdown-item @click="showCustomPathInput">
              {{ $t('accessWallet.addCustomPath') }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <p v-show="invalidPath !== ''" class="error-message-container">
        {{ $t('accessWallet.invalidPathDesc') }}{{ invalidPath
        }}{{ $t('accessWallet.invalidPathDescCont') }}
      </p>
      <p v-show="!customPathInput" class="derivation-brands">
        {{ getPathLabel(selectedPath) }}
      </p>
      <div v-show="customPathInput">
        <!-- TODO: how to structure the path input? -->
        <input
          id="customPathLabel"
          v-model="customPath.label"
          placeholder="my custom path"
        />
        <br />
        <input
          id="customPathInput"
          v-model="customPath.dpath"
          placeholder="m/44'/1'/0'/0"
        />
        <br />
        <button @click="addCustomPath">
          {{ $t('accessWallet.addCustomPath') }}
        </button>
        <button @click="showCustomPathInput">{{ $t('common.cancel') }}</button>
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
          <li />
        </ul>

        <ul
          v-for="account in HDAccounts"
          :data-address="'address' + account.index"
          :key="account.index"
          :class="selectedId === 'address' + account.index ? 'selected' : ''"
          class="address-block address-data"
          @click="setAccount(account);"
        >
          <li>{{ account.index }}.</li>
          <li>{{ account.account.getChecksumAddressString() }}</li>
          <li>{{ account.balance }} ETH</li>
          <li class="user-input-checkbox">
            <label class="checkbox-container checkbox-container-small">
              <input
                :id="'address' + account.index"
                type="checkbox"
                @click="unselectAllAddresses"
              />
              <span class="checkmark checkmark-small" />
            </label>
          </li>
        </ul>
      </div>
      <!-- .address-block-container -->

      <div class="address-nav">
        <span @click="previousAddressSet();"
          >&lt; {{ $t('common.previous') }}</span
        >
        <span @click="nextAddressSet();">{{ $t('common.next') }} &gt;</span>
      </div>
    </div>
    <!-- .content-container-2 -->

    <div class="accept-terms">
      <label class="checkbox-container"
        >{{ $t('accessWallet.acceptTerms') }}
        <router-link to="/terms-and-conditions">{{
          $t('common.terms')
        }}</router-link
        >.
        <input
          ref="accessMyWalletBtn"
          type="checkbox"
          @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled;"
        />
        <span class="checkmark" />
      </label>
    </div>
    <div class="button-container">
      <b-btn
        :disabled="accessMyWalletBtnDisabled"
        class="mid-round-button-green-filled close-button"
        @click.prevent="unlockWallet"
      >
        {{ $t('common.accessMyWallet') }}
      </b-btn>
    </div>
    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import ethUnits from 'ethjs-unit';
import { mapGetters } from 'vuex';
const MAX_ADDRESSES = 5;
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
      currentIndex: 0,
      HDAccounts: [],
      availablePaths: {},
      selectedPath: '',
      invalidPath: '',
      customPathInput: false,
      currentWallet: null,
      customPath: { label: '', dpath: '' }
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      customPaths: 'customPaths',
      path: 'path'
    })
  },
  watch: {
    hardwareWallet() {
      this.getPaths();
      this.setHDAccounts();
    }
  },
  mounted() {
    // reset component values when modal becomes hidden
    this.$refs.networkAndAddress.$on('hidden', () => {
      this.$refs.accessMyWalletBtn.checked = false;
      this.accessMyWalletBtnDisabled = true;
      this.availablePaths = {};
      this.selectedPath = '';
      this.invalidPath = '';
      this.customPathInput = false;
      this.currentWallet = null;
      this.customPath = { label: '', path: '' };
      this.resetPaginationValues();
    });
  },
  methods: {
    unselectAllAddresses: function(selected) {
      document
        .querySelectorAll('.user-input-checkbox input')
        .forEach(function(el) {
          el.checked = el.id === selected;
        });
    },
    setAccount(account) {
      this.selectedId = 'address' + account.index;
      this.unselectAllAddresses('address' + account.index);
      this.currentWallet = account.account;
    },
    resetPaginationValues() {
      this.currentIndex = 0;
    },
    showCustomPathInput() {
      this.customPath = { label: '', dpath: '' };
      this.customPathInput = !this.customPathInput;
    },
    addCustomPath() {
      // // TODO: figure out a more precise regex
      // // eslint-disable-next-line no-useless-escape
      // const regExp = /^\w+\/\d+'\/\d+'\/\d+'/;
      // if (regExp.test(this.customPath.dpath)) {
      //   this.$store.dispatch('addCustomPath', this.customPath).then(() => {
      //     this.getPaths();
      //   });
      //   this.showCustomPathInput(); // reset the path input
      // } else {
      //   // TODO: add indication of an invalid path
      // }
    },
    changePath(key) {
      this.resetPaginationValues();
      this.hardwareWallet.init(this.availablePaths[key].path).then(() => {
        this.getPaths();
        this.currentIndex = 0;
        this.setHDAccounts();
      });
    },
    unlockWallet() {
      this.$store.dispatch('decryptWallet', [this.currentWallet]);
      this.$router.push({ path: this.path !== '' ? this.path : 'interface' });
      this.$store.dispatch('setLastPath', '');
    },
    setHDAccounts() {
      this.HDAccounts = [];
      for (
        let i = this.currentIndex;
        i < this.currentIndex + MAX_ADDRESSES;
        i++
      ) {
        this.HDAccounts.push({
          index: i,
          account: this.hardwareWallet.getAccount(i),
          balance: 'loading'
        });
        this.getAddressBalance(
          this.HDAccounts[this.HDAccounts.length - 1].account.getAddressString()
        );
      }
      this.currentIndex += MAX_ADDRESSES;
    },
    getAddressBalance(address) {
      const web3 = this.web3;
      web3.eth.getBalance(address).then(balance => {
        for (const i in this.HDAccounts)
          if (this.HDAccounts[i].account.getAddressString() == address)
            this.HDAccounts[i].balance = ethUnits.fromWei(balance, 'ether');
      });
    },
    nextAddressSet() {
      this.setHDAccounts();
    },
    previousAddressSet() {
      this.currentIndex =
        this.currentIndex - 2 * MAX_ADDRESSES < 0
          ? 0
          : this.currentIndex - 2 * MAX_ADDRESSES;
      this.setHDAccounts();
    },
    getPathLabel(path) {
      for (const _p in this.availablePaths)
        if (this.availablePaths[_p].path === path)
          return this.availablePaths[_p].label;
      return 'Unknown';
    },
    getPaths() {
      this.selectedPath = this.hardwareWallet.getCurrentPath();
      this.availablePaths = this.hardwareWallet.getSupportedPaths();
      this.customPaths = this.customPaths;
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
