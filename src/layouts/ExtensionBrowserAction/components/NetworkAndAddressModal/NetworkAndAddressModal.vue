<template>
  <div>
    <b-modal
      ref="networkAddress"
      :title="$t('accessWallet.network-and-address')"
      hide-footer
      modal-class="modal-network-and-address nopadding"
      centered
    >
      <div class="modal-content-container">
        <div class="collapse-container">
          <b-btn
            v-b-toggle.collapse1
            class="collapse-open-button"
            variant="primary"
          >
            <p class="button-number">1</p>
            <div class="network">
              <p>{{ $t('common.network') }}</p>
              <p class="network-name monospace">
                ({{ selectedNetwork.type.name }} -
                {{ selectedNetwork.service }})
              </p>
            </div>
          </b-btn>
          <b-collapse
            id="collapse1"
            v-model="showCollapse1"
            class="collapse-content"
          >
            <ul class="networks">
              <li
                v-for="(key, index) in Object.keys(reorderNetworkList)"
                :key="$router.path + key + index"
              >
                <div class="network-title">
                  <div class="network-icon-container">
                    <img
                      v-if="Networks[key][0].type.icon"
                      :src="Networks[key][0].type.icon"
                    />
                    <div v-else class="no-icon">
                      <p>{{ $t('common.no-icon') }}</p>
                    </div>
                  </div>
                  <p>{{ key }}</p>
                </div>
                <div class="network-content">
                  <p
                    v-for="net in Networks[key]"
                    :key="net.service"
                    :class="
                      net.service === selectedNetwork.service &&
                      net.type &&
                      net.type.name === selectedNetwork.type.name
                        ? 'current-network'
                        : ''
                    "
                    @click="locSwitchNetwork(net)"
                  >
                    {{ net.service }}
                  </p>
                </div>
              </li>
            </ul>
          </b-collapse>
        </div>
        <div class="collapse-container">
          <b-btn
            v-b-toggle.collapse2
            class="collapse-open-button"
            variant="primary"
          >
            <p>{{ $t('common.addr') }}</p>
          </b-btn>
          <b-collapse
            id="collapse2"
            v-model="showCollapse2"
            class="collapse-content"
          >
            <div id="collapse2" class="collapse-content">
              <!-- Derivation Path Drop down -->
              <div class="content-container-1">
                <div class="hd-derivation">
                  <h4>{{ $t('accessWallet.hd-derivation-path') }}</h4>
                  <div class="dropdown-button-container">
                    <b-dropdown
                      id="hd-derivation-path"
                      :text="getPathLabel(selectedPath)"
                      right
                      class="dropdown-button-2"
                    >
                      <b-dropdown-item
                        v-for="(val, key) in availablePaths"
                        :key="'base' + key"
                        :class="selectedPath === val.path ? 'active' : ''"
                        @click="changePath(key)"
                        >{{ val.label }}</b-dropdown-item
                      >
                      <b-dropdown-divider />
                      <b-dropdown-item>
                        {{ $t('accessWallet.custom-paths') }}
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-for="(val, key) in customPaths"
                        :key="key"
                        :class="selectedPath === val.path ? 'active' : ''"
                        class="custom-networks"
                      >
                        <div @click="changePath(key)">{{ val.label }}</div>
                        <span>
                          <i
                            class="fa fa-times-circle"
                            @click.prevent="removeCustomPath(val)"
                          />
                        </span>
                      </b-dropdown-item>
                      <b-dropdown-item @click="showCustomPathInput">
                        {{ $t('accessWallet.add-custom-path') }}
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                </div>
                <p
                  v-show="invalidPath !== '' && customPathInput"
                  class="error-message-container"
                >
                  {{
                    $t('accessWallet.invalid-path-desc', {
                      path: invalidPath.path
                    })
                  }}
                </p>
                <p
                  v-show="!customPathInput"
                  class="derivation-brands monospace"
                >
                  {{ getPathLabel(selectedPath) }} ({{ selectedPath }})
                </p>
                <div v-show="customPathInput" class="custom-path-container">
                  <!-- TODO: how to structure the path input? -->
                  <label for="customPathLabel">{{ $t('mewcx.alias') }}</label>
                  <input
                    id="customPathLabel"
                    v-model="customPath.label"
                    :placeholder="$t('mewcx.custom-path')"
                  />
                  <label for="customPathInput">{{ $t('mewcx.path') }}</label>
                  <input
                    id="customPathInput"
                    v-model="customPath.path"
                    placeholder="m/44'/1'/0'/0"
                  />
                  <button
                    class="submit-button cancel"
                    @click="showCustomPathInput"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    class="submit-button submit"
                    @click="localAddCustomPath"
                  >
                    {{ $t('accessWallet.add-custom-path') }}
                  </button>
                </div>
              </div>
              <!-- Address List -->
              <div class="content-container-2">
                <div class="address-block-container">
                  <div class="block-title">
                    <h4>{{ $t('accessWallet.interact-addr') }}</h4>
                  </div>

                  <ul class="address-block table-header fours">
                    <li>{{ $t('accessWallet.id') }}</li>
                    <li>{{ $t('common.address') }}</li>
                    <li>{{ $t('common.balance') }}</li>
                  </ul>

                  <ul
                    v-for="account in HDAccounts"
                    :key="account.index"
                    :data-address="'address' + account.index"
                    :class="[
                      selectedId === 'address' + account.index
                        ? 'selected'
                        : '',
                      'address-block address-data fours'
                    ]"
                    @click="setAccount(account)"
                  >
                    <li>
                      <blockie
                        :address="account.account.getChecksumAddressString()"
                        :size="8"
                        :scale="16"
                        width="30px"
                        height="30px"
                      />
                    </li>
                    <li class="monospace">
                      {{
                        account.account.getChecksumAddressString() | concatAddr
                      }}
                    </li>
                    <li class="monospace">
                      {{ convertBalance(account.balance) }}
                    </li>
                    <li class="user-input-checkbox">
                      <label
                        class="checkbox-container checkbox-container-small"
                      >
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
                  <span @click="previousAddressSet()"
                    >&lt; {{ $t('common.previous') }}</span
                  >
                  <span @click="nextAddressSet()"
                    >{{ $t('common.next') }} &gt;</span
                  >
                </div>
              </div>
              <form>
                <div class="input-container">
                  <div class="network-password-input">
                    <input
                      v-model="locPassword"
                      :type="show ? 'text' : 'password'"
                      :placeholder="$t('mewcx.enter-pw')"
                    />
                    <img
                      :src="show ? showIcon : hide"
                      @click.prevent="show = !show"
                    />
                  </div>
                </div>
                <div class="button-container">
                  <b-btn
                    :class="[
                      validInputs ? '' : 'disabled',
                      !loading ? '' : 'disabled',
                      'network-submit'
                    ]"
                    type="submit"
                    @click.prevent="generateFromMnemonicPriv"
                  >
                    <span v-show="!loading">
                      {{ $t('mewcx.add-wallet') }}
                    </span>
                    <i v-show="loading" class="fa fa-spinner fa-spin" />
                  </b-btn>
                </div>
                <customer-support />
              </form>
            </div>
          </b-collapse>
        </div>
      </div>
      <!-- .modal-content-container -->
    </b-modal>
  </div>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { mapState, mapActions } from 'vuex';
import { Misc, Toast } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import Blockie from '@/components/Blockie';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';

const MAX_ADDRESSES = 5;
export default {
  components: {
    'customer-support': CustomerSupport,
    blockie: Blockie
  },
  props: {
    walletInstance: {
      type: Object,
      default: function() {
        return {};
      }
    },
    generateFromMnemonicPriv: {
      type: Function,
      default: () => {}
    },
    password: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedId: '',
      currentIndex: 0,
      HDAccounts: [],
      availablePaths: {},
      selectedPath: '',
      invalidPath: '',
      customPathInput: false,
      currentWallet: null,
      customPath: { label: '', dpath: '' },
      show: false,
      locPassword: this.password,
      hide: hide,
      showIcon: showIcon,
      showCollapse1: false,
      showCollapse2: true
    };
  },
  computed: {
    ...mapState('main', [
      'network',
      'Networks',
      'customPaths',
      'path',
      'web3',
      'wallet'
    ]),
    selectedNetwork() {
      return this.network;
    },
    reorderNetworkList() {
      return Misc.reorderNetworks();
    },
    validInputs() {
      return this.currentWallet && this.locPassword !== '';
    }
  },
  watch: {
    walletInstance(wallet) {
      if (wallet.hasOwnProperty('isHardware')) {
        this.getPaths();
        this.setHDAccounts();
      }
    },
    locPassword(newVal) {
      this.$emit('passwordUpdated', newVal);
    }
  },
  mounted() {
    // reset component values when modal becomes hidden
    this.$refs.networkAddress.$on('hidden', () => {
      this.selectedId = '';
      this.show = false;
      this.locPassword = '';
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
    ...mapActions('main', [
      'switchNetwork',
      'setWeb3Instance',
      'removeCustomPath'
    ]),
    locSwitchNetwork(network) {
      this.switchNetwork(network).then(() => {
        this.setWeb3Instance();
        this.currentIndex = 0;
        this.setHDAccounts();
      });
    },
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
      this.$emit('accountPath', [
        `${this.selectedPath}/${account.index}`,
        account.account.getChecksumAddressString()
      ]);
      this.currentWallet = account.account;
    },
    resetPaginationValues() {
      this.currentIndex = 0;
    },
    showCustomPathInput() {
      this.customPath = { label: '', path: '' };
      this.customPathInput = !this.customPathInput;
    },
    convertBalance(bal) {
      if (bal === 'loading') return bal;
      return new BigNumber(web3utils.fromWei(bal, 'ether')).toFixed(3);
    },
    removeCustomPath(path) {
      this.removeCustomPath(path).then(() => {
        this.getPaths();
      });
    },
    localAddCustomPath() {
      const customPath = this.checkCustomPath(this.customPath.path);
      if (customPath) {
        this.customPath.path = customPath;
        this.addCustomPath({
          label: this.customPath.label,
          path: customPath
        }).then(() => {
          this.getPaths();
        });
        this.showCustomPathInput(); // reset the path input
      } else {
        this.invalidPath = this.customPath;
      }
    },
    splitPath(path) {
      let array1;
      // eslint-disable-next-line
      const regExp = /(?<root>^\w+)\/?(?<bip>\d+)'?\/?(?<coin>\d+)'?\/?(?<chain>\d+)?'?\/?(?<account>.+$)/;
      const matcher = RegExp(regExp, 'g');
      if ((array1 = matcher.exec(path)) !== null) {
        return array1;
      }
      return null;
    },
    checkCustomPath(path) {
      path = path.trim();
      try {
        let array1;
        if ((array1 = this.splitPath(path)) !== null) {
          let assembledPath = '';
          if (array1[1]) {
            if (array1[1] !== 'm') return false;
            assembledPath = assembledPath.concat(array1[1]);
          } else {
            return false;
          }
          if (array1[2])
            assembledPath = assembledPath.concat('/', array1[2], "'");
          if (array1[3])
            assembledPath = assembledPath.concat('/', array1[3], "'");
          if (array1[4])
            assembledPath = assembledPath.concat('/', array1[4], "'");
          if (array1[5]) assembledPath = assembledPath.concat('/', array1[5]);
          return assembledPath;
        }
        return false;
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
        return false;
      }
    },
    changePath(key) {
      this.resetPaginationValues();
      let selectedPath;
      if (this.availablePaths[key]) {
        selectedPath = this.availablePaths[key].path;
      } else if (this.customPaths[key]) {
        selectedPath = this.customPaths[key].path;
      } else {
        selectedPath = this.selectedPath;
      }

      this.walletInstance
        .init(selectedPath)
        .then(() => {
          this.getPaths();
          this.currentIndex = 0;
          this.setHDAccounts();
          this.$refs.networkAddress.show();
        })
        .catch(error => {
          // if HD path is not supported by the hardware
          this.HDAccounts = [];
          Toast.responseHandler(error, Toast.ERROR);
        });
      this.selectedPath = this.walletInstance.hasOwnProperty('isHardware')
        ? this.walletInstance.getCurrentPath()
        : "m/44'/60'/0'/0";
    },
    setBalances: web3utils._.debounce(function() {
      this.HDAccounts.forEach(account => {
        const address = account.account.getAddressString();
        this.web3.eth
          .getBalance(address)
          .then(balance => {
            account.balance = balance;
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      });
    }, 1000),
    async setHDAccounts() {
      if (!this.web3.eth) this.setWeb3Instance();
      this.HDAccounts = [];
      for (
        let i = this.currentIndex;
        i < this.currentIndex + MAX_ADDRESSES;
        i++
      ) {
        const account = await this.walletInstance.getAccount(i);
        this.HDAccounts.push({
          index: i,
          account: account,
          balance: 'loading'
        });
        this.setBalances();
      }
      this.currentIndex += MAX_ADDRESSES;
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
      for (const _p in this.availablePaths) {
        if (this.availablePaths[_p].path === path) {
          return this.availablePaths[_p].label;
        }
      }
      for (const _p in this.customPaths) {
        if (this.customPaths[_p].path === path) {
          return this.customPaths[_p].label;
        }
      }
      return 'Unknown';
    },
    getPaths() {
      this.selectedPath = this.walletInstance.getCurrentPath();
      this.availablePaths = this.walletInstance.getSupportedPaths();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NetworkAndAddressModal.scss';
</style>
