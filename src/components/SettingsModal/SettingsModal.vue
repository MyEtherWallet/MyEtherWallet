<template>
  <div class="settings-modal">
    <div class="modal-container">
      <b-modal
        ref="settings"
        :title="$t('interface.settings')"
        hide-footer
        centered
        class="bootstrap-modal nopadding"
        static
        lazy
      >
        <div class="modal-contents">
          <full-width-dropdown
            ref="gasDropdown"
            :title="$t('interface.config.tx-speed')"
            class="tx-speed"
          >
            <div class="radio-buttons">
              <ul>
                <li
                  v-for="(val, key) in gasPriceInputs"
                  :key="key"
                  :class="selectedGasType === key ? 'selected' : ''"
                >
                  <div>
                    <input
                      :id="key"
                      :value="key"
                      :checked="selectedGasType === key"
                      name="speedRadioInputs"
                      type="radio"
                      @change="selectGasType(key)"
                    />
                    <label :for="key">
                      {{ $t('interface.' + key) }}
                      ({{ displayedGasPriceValue(gasPriceInputs[key].gwei) }}
                      {{ $t('common.gas.gwei') }})
                    </label>
                  </div>
                </li>
                <li :class="selectedGasType === 'other' ? 'selected' : ''">
                  <div>
                    <input
                      id="ccc"
                      :checked="selectedGasType === 'other'"
                      type="radio"
                      name="speedRadioInputs"
                      value="other"
                      @change="selectGasType('other')"
                    />
                    <input
                      ref="customInput"
                      v-model="customGas"
                      type="number"
                      :placeholder="$t('common.gas.price-range')"
                      @focus="selectedGasType = 'other'"
                    />
                    <p class="gwei">{{ $t('common.gas.gwei') }}</p>
                  </div>
                  <p class="hidden">
                    {{ customGasEth }}
                    {{ network.type.currencyName }}
                    <span
                      v-if="
                        ethPrice !== 0 &&
                        customGasEth !== 0 &&
                        network.type.name === 'ETH'
                      "
                      >($ {{ convert(customGasEth) }})</span
                    >
                  </p>
                </li>
              </ul>
            </div>
            <div class="button-block">
              <standard-button
                :options="{
                  title: $t('common.save'),
                  buttonStyle: 'green',
                  rightArrow: false,
                  leftArrow: false,
                  mobileFullWidth: true
                }"
                :button-disabled="selectedGasType === 'other' && customGas < 1"
                :click-function="saveGasChanges"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.config.import')"
            class="import-config"
          >
            <b-alert :show="popup" fade variant="info">{{
              $t('interface.config.import-success')
            }}</b-alert>
            <p>
              {{ $t('interface.config.import-desc') }}
            </p>
            <div class="import-button-block">
              <div class="filename">
                {{ inputFileName }}
              </div>
              <input
                ref="uploadInput"
                type="file"
                name="file"
                @change="receiveUploadedFile"
              />
              <standard-button
                :options="{
                  title: $t('interface.config.upload-f'),
                  buttonStyle: 'green-border',
                  rightArrow: false,
                  leftArrow: false,
                  fullWidth: true,
                  noMinWidth: true
                }"
                :click-function="uploadFile"
              />
            </div>
            <div class="button-block">
              <standard-button
                :options="{
                  title: $t('interface.config.import-short'),
                  buttonStyle: 'green',
                  rightArrow: false,
                  leftArrow: false,
                  fullWidth: true,
                  noMinWidth: false
                }"
                :button-disabled="importedFile === ''"
                :click-function="setDataFromImportedFile"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.config.export')"
            class="export-config"
          >
            <p>
              {{ $t('interface.config.export-desc') }}
            </p>
            <div class="button-block">
              <a
                :href="file"
                :download="fileName"
                rel="noopener noreferrer"
                class="export-button"
              >
                <standard-button
                  :options="{
                    title: $t('interface.config.export-short'),
                    buttonStyle: 'green',
                    rightArrow: false,
                    leftArrow: false,
                    mobileFullWidth: true
                  }"
                />
              </a>
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            :title="$t('interface.address-book.title')"
            class="address-book"
          >
            <p>
              {{ $t('interface.address-book.add-up-to') }}
            </p>
            <div class="table-container">
              <table
                v-if="sortedAddressBook.length > 0"
                class="contact-container"
              >
                <colgroup>
                  <col width="5%" />
                  <col width="55%" />
                  <col width="20%" />
                  <col width="20%" />
                </colgroup>
                <thead>
                  <tr class="header">
                    <th>#</th>
                    <th>{{ $t('common.addr') }}</th>
                    <th>{{ $t('interface.address-book.nickname') }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(contact, index) in sortedAddressBook"
                    :key="contact.key"
                  >
                    <td class="numbered">{{ index + 1 }}.</td>
                    <td class="addr-container">
                      <blockie
                        :address="contact.resolverAddr"
                        width="25px"
                        height="25px"
                        class="blockie-image"
                      />
                      <a
                        :href="
                          'https://etherscan.io/address/' + contact.address
                        "
                        rel="noopener noreferrer"
                        class="contact-addr"
                        target="_blank"
                        >{{ contact.address }}</a
                      >
                    </td>
                    <td class="addr-nickname">
                      {{ contact.nickname }}
                    </td>
                    <td>
                      <span
                        class="edit-txt"
                        @click="openAddrBookModal('edit', contact)"
                      >
                        {{ $t('interface.address-book.edit') }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="addr-btn-container">
              <button
                :class="addressBook.length >= 10 ? 'disabled' : ''"
                @click="openAddrBookModal('add')"
              >
                +{{ $t('interface.address-book.add') }}
              </button>
            </div>
          </full-width-dropdown>
        </div>
      </b-modal>
    </div>
    <address-book-modal
      ref="addressBook"
      :current-idx="currentAddressIdx"
      :title="addrBookModalTitle"
      :modal-action="modalAction"
    />
  </div>
</template>

<script>
import AddressBookModal from '@/components/AddressBookModal';
import FullWidthDropdownMenu from '@/components/FullWidthDropdownMenu';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import store from 'store';
import { Toast } from '@/helpers';
import { mapState, mapActions } from 'vuex';
import Blockie from '@/components/Blockie';
import {
  getEconomy,
  getRegular,
  getFast,
  getOther,
  fastToEconomy,
  regularToEconomy
} from '@/helpers/gasMultiplier';
export default {
  name: 'Settings',
  components: {
    'full-width-dropdown': FullWidthDropdownMenu,
    'address-book-modal': AddressBookModal,
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputFileName: '',
      selectedGasType: 'economy',
      customGas: 0,
      customGasEth: 0,
      ethPrice: 0,
      fileName: '',
      file: '',
      importedFile: '',
      popup: false,
      currentAddressIdx: null,
      addrBookModalTitle: '',
      modalAction: ''
    };
  },
  computed: {
    ...mapState('main', ['network', 'online', 'addressBook', 'gasPrice']),
    sortedAddressBook() {
      return this.addressBook.slice().sort((a, b) => {
        a = a.nickname.toString().toLowerCase();
        b = b.nickname.toString().toLowerCase();

        return a < b ? -1 : a > b ? 1 : 0;
      });
    },
    gasPriceInputs() {
      return {
        economy: {
          gwei: getEconomy(this.baseGasPrice)
        },
        regular: {
          gwei: getRegular(this.baseGasPrice)
        },
        fast: {
          gwei: getFast(this.baseGasPrice)
        }
      };
    },
    baseGasPrice() {
      // computed hack to make it react to network
      this.network;
      const fetchedGasPrice =
        store.get('fetchedGasPrice') || store.get('gasPrice') || 41;
      const type = store.get('gasPriceType') || 'economy';
      const gasPrice = type === 'other' ? fetchedGasPrice : this.gasPrice;
      return type === 'fast'
        ? fastToEconomy(gasPrice)
        : type === 'regular'
        ? regularToEconomy(gasPrice)
        : gasPrice;
    }
  },
  watch: {
    customGas(newVal) {
      store.set('customGasPrice', newVal);
      if (newVal !== '') {
        if (new BigNumber(newVal).gte(1)) {
          const toGwei = new BigNumber(
            utils.toWei(`${new BigNumber(newVal).toFixed(9)}`, 'gwei')
          ).toFixed();
          this.customGasEth = new BigNumber(
            `${utils.fromWei(toGwei, 'ether')}`
          ).toFixed();
        } else {
          this.customGas = 1;
        }
      }
    }
  },
  mounted() {
    if (this.online) {
      this.getEthPrice();
    }
    this.exportConfig();
    this.getGasType();
    this.customGas = getOther();
  },
  methods: {
    ...mapActions('main', ['setGasPrice', 'setAddressBook']),
    displayedGasPriceValue(value) {
      const newVal = new BigNumber(value).toString();
      const showMore = `~${new BigNumber(value).toString()}`;
      const showSome = `~${new BigNumber(value).toFixed(2).toString()}`;
      return newVal.includes('.')
        ? new BigNumber(newVal).lt(25)
          ? showMore
          : showSome
        : newVal;
    },
    setDataFromImportedFile() {
      const reader = new FileReader();
      const notifObj = {};
      notifObj[this.address] = [];
      reader.onloadend = evt => {
        try {
          const notifications = store.get('notifications') || notifObj;
          const file = JSON.parse(evt.target.result);
          const fNotifications = file.notifications || [];
          fNotifications.forEach(objAddr => {
            const addr = Object.keys(objAddr)[0];
            notifications[addr] = objAddr[addr];
          });
          store.set('notifications', notifications);
          store.set('skipTutorial', file.main.skipTutorial);
          store.set('customTokens', file.main.customTokens);
          store.set('customNetworks', file.main.customNetworks);
          store.set('customDeriviationPaths', file.main.customDeriviationPaths);
          store.set('gas', file.main.gas);

          this.popup = true;

          setTimeout(() => {
            this.popup = false;
          }, 1500);
        } catch (e) {
          Toast.responseHandler(
            new Error(this.$t('interface.import-error')),
            Toast.ERROR
          );
        }
      };
      reader.readAsBinaryString(this.importedFile);
    },
    receiveUploadedFile(e) {
      const pathParts = e.target.value.split('\\');
      this.inputFileName = pathParts[pathParts.length - 1];

      this.importedFile = e.target.files[0];
    },
    getGasType() {
      const type = store.get('gasPriceType');
      const amt = store.get('gasPrice');
      const customGas = getOther();
      if (type) {
        this.selectedGasType = type;
      }

      if (amt) {
        if (this.gasPriceInputs[type] !== undefined) {
          this.setGasPrice(
            new BigNumber(this.gasPriceInputs[type].gwei).toNumber()
          );
        } else {
          this.customGas = customGas;
          this.setGasPrice(new BigNumber(customGas).toNumber());
        }
      }
    },
    uploadFile() {
      const uploadInput = this.$refs.uploadInput;
      uploadInput.value = '';
      uploadInput.click();
    },
    saveGasChanges() {
      store.set('gasPriceType', this.selectedGasType);
      if (this.gasPriceInputs[this.selectedGasType] !== undefined) {
        this.setGasPrice(
          new BigNumber(
            this.gasPriceInputs[this.selectedGasType].gwei
          ).toNumber()
        );
      } else {
        const gasPrice = new BigNumber(this.customGas).toNumber().toFixed(9);
        store.set('customGasPrice', gasPrice);
        this.setGasPrice(gasPrice);
      }
      if (this.$refs.gasDropdown) {
        this.$refs.gasDropdown.dropdownOpen = false;
      }
    },
    selectGasType(type) {
      this.selectedGasType = type;
      if (type === 'other') {
        this.$refs.customInput.focus();
      }
    },
    exportConfig() {
      const time = new Date().toISOString();
      const notifications = [];
      const storedNotifs = store.get('notifications') || {};
      Object.keys(storedNotifs).forEach(item => {
        if (storedNotifs[item].length > 0) {
          const obj = {};
          obj[item] = storedNotifs[item];
          notifications.push(obj);
        }
      });
      const gas = {};
      if (this.gasPriceInputs[this.selectedGasType] !== undefined) {
        gas['speed'] = this.selectedGasType;
      } else {
        gas['price'] = this.customGas;
      }

      const exportableObject = {
        timestamp: time,
        main: {
          customNetworks:
            store.get('customNetworks') !== undefined
              ? store.get('customNetworks')
              : [],
          customTokens:
            store.get('customTokens') !== undefined
              ? store.get('customTokens')
              : {},
          customDeriviationPaths:
            store.get('customDeriviationPaths') !== undefined
              ? store.get('customDeriviationPaths')
              : [],
          gas: gas,
          skipTutorial: true
        },
        notifications: notifications
      };

      this.fileName = `mew-export-${time}.json`;

      const file = new Blob([JSON.stringify(exportableObject)], {
        type: 'application/json'
      });
      this.file = window.URL.createObjectURL(file);
    },
    convert(price) {
      const convertedPrice = new BigNumber(price * this.ethPrice).toFixed();
      return this.$options.filters.concatAddr(convertedPrice);
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });

      this.ethPrice = price && price.data ? price.data.ETH.quotes.USD.price : 0;
    },
    openAddrBookModal(action, obj) {
      const idx = this.addressBook.indexOf(obj);
      this.currentAddressIdx = action === 'edit' ? idx : null;
      this.modalAction = action;
      this.addrBookModalTitle =
        action === 'add'
          ? 'interface.address-book.add-new'
          : 'interface.address-book.edit-addr';
      this.$refs.addressBook.$refs.addressBookModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
