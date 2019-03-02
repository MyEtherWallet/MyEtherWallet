<template>
  <div class="settings-modal">
    <div class="modal-container">
      <b-modal
        ref="settings"
        title="Settings"
        hide-footer
        centered
        class="bootstrap-modal nopadding"
      >
        <div class="modal-contents">
          <full-width-dropdown
            ref="gasDropdown"
            title="Transaction Speed"
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
                      {{ key | capitalize }} ({{ gasPriceInputs[key].gwei }}
                      Gwei)
                    </label>
                  </div>
                  <p>
                    {{ gasPriceInputs[key].eth }} {{ network.type.name }}
                    <span v-if="ethPrice !== 0 && network.type.name === 'ETH'">
                      ($
                      {{ convert(gasPriceInputs[key].eth) }})
                    </span>
                  </p>
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
                      @focus="selectedGasType = 'other'"
                    />
                    <p class="gwei">Gwei</p>
                  </div>
                  <p>
                    {{ customGasEth }} {{ network.type.name }}
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
                :options="buttonSave"
                @click.native="saveGasChanges"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            title="Import Configurations"
            class="import-config"
          >
            <b-alert :show="popup" fade variant="info"
              >Imported file successfully!</b-alert
            >
            <p>
              Please click the button below to open and import you configuration
              file from your local computer.
            </p>
            <div class="import-button-block">
              <div class="filename">
                <standard-input :options="inputFileName" />
              </div>
              <input
                ref="uploadInput"
                type="file"
                name="file"
                style="display: none"
                @change="receiveUploadedFile"
              />
              <standard-button
                :options="buttonUploadFile"
                @click.native="uploadFile"
              />
            </div>
            <div class="button-block">
              <standard-button
                :options="buttonImport"
                @click.native="setDataFromImportedFile"
              />
            </div>
          </full-width-dropdown>

          <full-width-dropdown
            title="Export Configurations"
            class="export-config"
          >
            <p>
              Please click the button below to download your configuration file
              into your local computer.
            </p>
            <div class="button-block">
              <a :href="file" :download="fileName" class="export-button">
                <standard-button :options="buttonExport" />
              </a>
            </div>
          </full-width-dropdown>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import FullWidthDropdownMenu from '@/components/FullWidthDropdownMenu';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import store from 'store';
import { Toast } from '@/helpers';
import { mapGetters } from 'vuex';

export default {
  name: 'Settings',
  components: {
    'full-width-dropdown': FullWidthDropdownMenu
  },
  props: {
    gasPrice: {
      type: String,
      default: '0'
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buttonSave: {
        title: 'Save',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        mobileFullWidth: true
      },
      buttonExport: {
        title: 'Export',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        mobileFullWidth: true
      },
      buttonUploadFile: {
        title: 'Upload File...',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonImport: {
        title: 'Import',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: false
      },
      inputFileName: {
        title: '',
        value: '',
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: '',
        readOnly: true
      },
      selectedGasType: 'regular',
      customGas: 0,
      customGasEth: 0,
      ethPrice: 0,
      fileName: '',
      file: '',
      importedFile: '',
      popup: false
    };
  },
  computed: {
    ...mapGetters({
      network: 'network'
    }),
    gasPriceInputs() {
      return {
        economy: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(2).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(2).toFixed(0),
              'ether'
            )
          ).toFixed()
        },
        regular: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(1).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(1).toFixed(0),
              'ether'
            )
          ).toFixed()
        },
        fast: {
          gwei: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).times(1.25).toFixed(0),
              'gwei'
            )
          ).toFixed(),
          eth: new BigNumber(
            utils.fromWei(
              new BigNumber(this.gasPrice).div(1.25).toFixed(0),
              'ether'
            )
          ).toFixed()
        }
      };
    }
  },
  watch: {
    customGas(newVal) {
      if (newVal !== '') {
        const toGwei = new BigNumber(
          utils.toWei(`${newVal}`, 'gwei')
        ).toFixed();
        this.customGasEth = new BigNumber(
          `${utils.fromWei(toGwei, 'ether')}`
        ).toFixed();
      }
    },
    gasPrice() {
      this.saveGasChanges();
    }
  },
  mounted() {
    this.getEthPrice();
    this.exportConfig();
  },
  methods: {
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
            new Error(
              'Something went wrong while importing file, please make sure it is a valid file'
            ),
            Toast.ERROR
          );
        }
      };
      reader.readAsBinaryString(this.importedFile);
    },
    receiveUploadedFile(e) {
      this.inputFileName = {
        value: e.target.value,
        type: 'text',
        buttonCopy: false,
        buttonClear: false,
        buttonCustom: '',
        topTextInfo: '',
        popover: '',
        placeHolder: '',
        rightInputText: ''
      };

      this.importedFile = e.target.files[0];
    },
    uploadFile() {
      const uploadInput = this.$refs.uploadInput;
      uploadInput.value = '';
      uploadInput.click();
    },
    saveGasChanges() {
      if (this.gasPriceInputs[this.selectedGasType] !== undefined) {
        this.$store.dispatch(
          'setGasPrice',
          new BigNumber(
            this.gasPriceInputs[this.selectedGasType].gwei
          ).toNumber()
        );
      } else {
        this.$store.dispatch(
          'setGasPrice',
          new BigNumber(this.customGas).toNumber()
        );
      }
      this.$refs.gasDropdown.dropdownOpen = false;
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

      this.ethPrice = price.data.ETH.quotes.USD.price;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
