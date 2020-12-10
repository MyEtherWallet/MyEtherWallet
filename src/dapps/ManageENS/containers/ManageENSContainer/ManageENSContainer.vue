<template>
  <div class="manage-ens-container">
    <div class="title-container">
      <h3>{{ $t('ens.manage-domain') }}</h3>
      <h3>{{ domainName }}</h3>
    </div>
    <div v-show="!isController" class="set-controller-container">
      <i18n path="ens.controller-text" tag="div">
        <b slot="domain">{{ domainName }}</b
        ><b slot="addr">{{ account.address }}</b>
        <br />
      </i18n>
      <div class="set-controller-submit">
        <button @click="setController()">{{ $t('ens.set-controller') }}</button>
      </div>
    </div>
    <b-btn
      v-show="resolverMultiCoinSupport"
      v-b-toggle.multicoinsec
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.multi-coin') }}</p>
      <i class="when-open fa fa-angle-up fa-lg" />
      <i class="when-closed fa fa-angle-down fa-lg" />
    </b-btn>
    <b-collapse
      id="multicoinsec"
      :visible="resolverMultiCoinSupport"
      class="collapse-content"
      accordion="manage-ens-accordion"
    >
      <div class="form-container">
        <form class="manage-multi-coin-form">
          <div class="title-and-dropdown-container">
            <h4>{{ $t('ens.multi-coin') }}:</h4>
            <b-dd :text="selectedCurrency" class="dropdown-button-2">
              <b-dd-item
                v-for="(item, idx) in Object.keys(supportedCoins)"
                :key="item + idx"
                @click="addCurrencyInput(item)"
                >{{ item }}</b-dd-item
              >
            </b-dd>
          </div>
          <div
            v-for="(v, k) in currencyInputs"
            :key="k.id"
            class="multi-coin-input-container"
          >
            <label for="updateResolver">{{ k }}:</label>
            <input
              v-model="v.value"
              :placeholder="v.name + ' address'"
              type="text"
              name="updateResolver"
            />
            <i
              :class="[
                'validity-indication fa',
                isInvalidAddress(v)
                  ? 'error fa-times-circle-o'
                  : 'valid fa-check-circle-o'
              ]"
            />
            <i
              class="fa fa-lg fa-times"
              @click="
                () => {
                  removeCoinInput(k);
                }
              "
            />
          </div>
          <div class="multi-coin-submit-container">
            <button
              :class="[
                isValidAddresses ? '' : 'disabled',
                isController ? '' : 'disabled'
              ]"
              @click.prevent="checkAndSendCurrency"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <b-btn
      v-b-toggle.textrecords
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.txt-record') }}</p>
      <i class="when-open fa fa-angle-up fa-lg" />
      <i class="when-closed fa fa-angle-down fa-lg" />
    </b-btn>
    <b-collapse
      id="textrecords"
      :visible="!resolverMultiCoinSupport && resolverTxtSupport"
      class="collapse-content"
      accordion="manage-ens-accordion"
    >
      <div class="form-container">
        <form class="manage-multi-coin-form">
          <div class="title-and-dropdown-container">
            <h4>{{ $t('ens.txt-record') }}:</h4>
            <b-dd :text="selectedText | capitalize" class="dropdown-button-2">
              <b-dd-item
                v-for="(item, idx) in Object.keys(txtRecords)"
                :key="item + idx"
                @click="addTxtInput(item)"
                >{{ item | capitalize }}</b-dd-item
              >
            </b-dd>
          </div>
          <div v-for="(v, k) in txtRecordInputs" :key="k.id">
            <div class="multi-coin-input-container">
              <label for="updateResolver">{{ k | capitalize }}:</label>
              <input
                v-model="txtRecordInputs[k]"
                v-validate="getInputType(k)"
                :placeholder="k | capitalize"
                :name="k"
                type="text"
              />
              <i
                :class="[
                  'validity-indication fa',
                  !!txtRecordInputs[k] &&
                  txtRecordInputs[k] !== '' &&
                  !errors.hasOwnProperty(`${k}`) &&
                  validateTxtValue(k)
                    ? 'valid fa-check-circle-o'
                    : 'error fa-times-circle-o'
                ]"
              />
              <i
                class="fa fa-lg fa-times"
                @click="
                  () => {
                    removeTxtInput(k);
                  }
                "
              />
            </div>
            <p v-show="!validateTxtValue(k)" class="text-error">
              {{
                $t('ens.text-record-error', {
                  value: txtRecordInputs[k],
                  name: k
                })
              }}
            </p>
          </div>
          <div class="multi-coin-submit-container">
            <button
              :class="[
                validTextRecords ? 'disabled' : '',
                isController ? '' : 'disabled'
              ]"
              @click.prevent="checkAndSendTxtRecs"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <b-btn
      v-b-toggle.transferens
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.transfer-domain') }}</p>
      <i class="when-open fa fa-angle-up fa-lg" />
      <i class="when-closed fa fa-angle-down fa-lg" />
    </b-btn>
    <b-collapse
      id="transferens"
      :visible="!resolverMultiCoinSupport && !resolverTxtSupport"
      class="collapse-content"
      accordion="manage-ens-accordion"
    >
      <div class="form-container">
        <form class="manage-form">
          <div class="input-container">
            <label for="transferEns">{{ $t('ens.transfer-to') }}:</label>
            <input
              v-model="transferTo"
              type="text"
              name="transferEns"
              placeholder="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
            />
          </div>
          <div class="submit-container">
            <button
              :class="[!isAddress(transferTo) ? 'disabled' : '']"
              type="submit"
              @click.prevent="transferDomain(transferTo)"
            >
              {{ $t('ens.transfer') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <b-btn
      v-if="isDeedOwner && hasDeed"
      v-b-toggle.redeemdeed
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.release-deed') }}</p>
      <i class="when-open fa fa-angle-up fa-lg" />
      <i class="when-closed fa fa-angle-down fa-lg" />
    </b-btn>
    <b-collapse
      v-if="isDeedOwner && hasDeed"
      id="redeemdeed"
      class="collapse-content"
      accordion="manage-ens-accordion"
    >
      <div v-if="isDeedOwner && hasDeed" class="form-container">
        <form>
          <h4>
            {{
              $t('ens.release-deed-confirmation', {
                deedValueEth: deedValueEth,
                network: network.type.name
              })
            }}
          </h4>
          <div class="submit-container">
            <button type="submit" @click.prevent="releaseDeed()">
              {{ $t('ens.release-deed') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <b-btn v-b-toggle.ipfs class="collapse-open-button" variant="primary">
      <p>{{ $t('ens.content-hash') }}</p>
      <i class="when-open fa fa-angle-up fa-lg" />
      <i class="when-closed fa fa-angle-down fa-lg" />
    </b-btn>
    <b-collapse
      id="ipfs"
      class="collapse-content"
      accordion="manage-ens-accordion"
    >
      <div v-if="ipfsProcessing" class="ipfs-loading">
        <i class="fa fa-lg fa-spinner fa-spin" />
        <h3>{{ $t('ens.ipfs-processing') }}</h3>
        <p>{{ $t('ens.ipfs-processing-description') }}</p>
      </div>
      <div v-else class="ipfs-content-container">
        <div v-if="validIpfs" class="link-to-name">
          <p>
            {{
              $t('ens.ipfs-check-website', {
                domainName: domainName
              })
            }}
            <a
              :href="`http://${domainName}.link`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ `${domainName}.link` }}
            </a>
          </p>
        </div>
        <form enctype="multipart/form-data" novalidate class="file-upload-form">
          <input
            ref="zipInput"
            type="file"
            name="file"
            accept=".zip"
            @change="fileChange"
          />
        </form>
        <div class="form-container">
          <form class="manage-form">
            <div class="input-container">
              <label for="transferEns">
                <span>{{ $t('ens.content-hash') }}:</span>
                <p class="file-upload-text" @click.prevent="ipfsClick">
                  {{ $t('ens.upload-my-website') }}
                </p>
              </label>
              <input
                v-model="localContentHash"
                type="text"
                name="transferEns"
                placeholder="QmVHxRocoWgUChLEvfEyDuuD6qJ4PhdDL2dTLcpUy3dSC2"
              />
            </div>
            <div class="submit-container">
              <span v-if="!validIpfs" class="text-error">{{
                $t('ens.error.empty-invalid-ipfs')
              }}</span>
              <br />
              <button
                :class="[!validIpfs ? 'disabled' : '']"
                type="submit"
                @click.prevent="saveContentHash(localContentHash)"
              >
                {{ $t('ens.set-hash') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </b-collapse>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://howto.xinfin.org/XinFinWallet/features"
    />
  </div>
</template>
<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { isAddress } from '@/helpers/addressUtils';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import utils from 'web3-utils';
import supportedTxt from '../../supportedTxt';
import isIpfs from 'is-ipfs';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    setMultiCoin: {
      type: Function,
      default: function () {}
    },
    setRecord: {
      type: Function,
      default: function () {}
    },
    transferDomain: {
      type: Function,
      default: function () {}
    },
    tld: {
      type: String,
      default: ''
    },
    resolverMultiCoinSupport: {
      type: Boolean,
      default: false
    },
    resolverTxtSupport: {
      type: Boolean,
      default: false
    },
    supportedCoins: {
      type: Object,
      default: function () {}
    },
    setController: {
      type: Function,
      default: function () {}
    },
    txtRecords: {
      type: Object,
      default: function () {}
    },
    isController: {
      type: Boolean,
      default: false
    },
    hasDeed: {
      type: Boolean,
      default: false
    },
    isDeedOwner: {
      type: Boolean,
      default: false
    },
    deedValue: {
      type: String,
      default: '0'
    },
    releaseDeed: {
      type: Function,
      default: () => {}
    },
    contentHash: {
      type: String,
      default: ''
    },
    uploadFile: {
      type: Function,
      default: () => {}
    },
    saveContentHash: {
      type: Function,
      default: () => {}
    },
    ipfsProcessing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const newCoinsCopy = this.copySupported();
    const newtxtRecords = {};
    const txtValidators = {};

    supportedTxt.forEach(item => {
      txtValidators[item.name] = item.validate;
    });
    for (const key in newCoinsCopy) {
      if (
        newCoinsCopy[key].hasOwnProperty('value') &&
        newCoinsCopy[key].value === ''
      )
        delete newCoinsCopy[key];
    }

    for (const key in this.txtRecords) {
      if (this.txtRecords[key] !== '') {
        newtxtRecords[key] = this.txtRecords[key];
      }
    }
    return {
      transferTo: '',
      multiCoinSupport: false,
      isAddress: isAddress,
      currencyInputs: newCoinsCopy,
      selectedCurrency: 'ETH',
      selectedText: 'Email',
      hasError: false,
      txtRecordInputs: newtxtRecords,
      txtValidators: txtValidators,
      localContentHash: this.contentHash || ''
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account', 'network']),
    validIpfs() {
      return isIpfs.multihash(this.localContentHash);
    },
    deedValueEth() {
      return utils.fromWei(this.deedValue, 'ether');
    },
    isValidAddresses() {
      for (const type in this.currencyInputs) {
        if (
          this.currencyInputs[type].id === this.currencyInputs.ETH.id &&
          this.currencyInputs[type].value === ''
        )
          return false;
        if (
          this.currencyInputs[type].value !== '' &&
          !this.currencyInputs[type].validator.validate(
            this.currencyInputs[type].value
          )
        )
          return false;
      }
      return true;
    },
    validTextRecords() {
      for (const type in this.txtRecordInputs) {
        if (
          this.txtRecordInputs[type] &&
          this.txtRecordInputs[type] !== '' &&
          !this.txtValidators[type](this.txtRecordInputs[type])
        )
          return true;
      }
      return false;
    }
  },
  watch: {
    currencyInputs: {
      handler: function (newVal) {
        this.currencyInputs = newVal;
      },
      deep: true
    },
    txtRecordInputs: {
      handler: function (newVal) {
        this.txtRecordInputs = newVal;
      },
      deep: true
    }
  },
  mounted() {
    if (this.domainName === '.') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  },
  methods: {
    fileChange(e) {
      const TYPES = [
        'application/zip',
        'application/x-zip',
        'application/octet-stream',
        'application/x-zip-compressed'
      ];
      const supportedFile = TYPES.find(item => {
        return (
          e.target.files[0].type === item ||
          e.target.files[0].name.includes('.zip')
        );
      });
      if (!supportedFile) {
        this.$refs.zipInput.value = '';
        Toast.responseHandler(this.$t('ens.warning.upload-zip'), Toast.WARN);
        return;
      }
      if (e.target.files[0].size < 500) {
        this.$refs.zipInput.value = '';
        Toast.responseHandler(this.$t('ens.warning.too-small'), Toast.WARN);
        return;
      }

      if (e.target.files[0].size > 50000000) {
        this.$refs.zipInput.value = '';
        Toast.responseHandler(this.$t('ens.warning.too-big'), Toast.WARN);
        return;
      }

      this.uploadFile(e.target.files[0]);
    },
    ipfsClick() {
      const input = this.$refs.zipInput;
      input.value = '';
      input.click();
    },
    isInvalidAddress(type) {
      if (type.id === this.supportedCoins.ETH.id && type.value === '')
        return true;
      return type.value !== '' && !type.validator.validate(type.value);
    },
    getInputType(name) {
      const foundObj = supportedTxt.find(item => {
        return item.name.toLowerCase() === name.toLowerCase();
      });

      switch (foundObj.type) {
        case 'url':
          return 'required|url:require_protocol';
        case 'email':
          return 'email|required';
        default:
          return 'required';
      }
    },
    validateTxtValue(name) {
      return this.txtValidators[name](this.txtRecordInputs[name]);
    },
    copySupported() {
      const newObj = utils._.map(this.supportedCoins, utils._.clone);
      const copiedObj = {};
      newObj.forEach(item => {
        copiedObj[item.symbol] = item;
      });

      return copiedObj;
    },
    addCurrencyInput(item) {
      this.selectedCurrency = item;
      const unRefSupportedCoins = this.copySupported();
      const newObj = Object.assign({}, this.currencyInputs);
      if (!newObj[item]) {
        newObj[item] = unRefSupportedCoins[item];
        this.currencyInputs = newObj;
      } else {
        Toast.responseHandler(
          this.$t('ens.currency-already-exists', {
            currency: item,
            domainName: this.domainName
          }),
          Toast.WARN
        );
      }
    },
    addTxtInput(item) {
      this.selectedText = item;
      const newObj = Object.assign({}, this.txtRecordInputs);
      if (!newObj[item]) {
        newObj[item] = this.txtRecordInputs[item];
        this.txtRecordInputs = newObj;
      } else {
        Toast.responseHandler(
          this.$t('ens.currency-already-exists', {
            txtRecord: item,
            domainName: this.domainName
          }),
          Toast.WARN
        );
      }
    },
    removeCoinInput(name) {
      const newObj = Object.assign({}, this.currencyInputs);
      newObj[name].value = '';
      this.currencyInputs = newObj;
    },
    removeTxtInput(name) {
      const newObj = Object.assign({}, this.txtRecordInputs);
      newObj[name] = '';
      this.txtRecordInputs = newObj;
    },
    checkAndSendTxtRecs() {
      if (this.domainName !== '.') {
        const changed = {};

        const currencyInputsObj = Object.assign({}, this.txtRecordInputs);
        const currentSupported = Object.assign({}, this.txtRecords);
        Object.keys(currentSupported).forEach(item => {
          if (
            currencyInputsObj[item] &&
            currentSupported[item] !== currencyInputsObj[item]
          ) {
            changed[item] = currencyInputsObj[item];
          }
        });
        if (Object.keys(changed).length > 0) {
          this.setRecord(changed);
        }
      }
    },
    checkAndSendCurrency() {
      if (this.domainName !== '.') {
        const changed = [];
        const currencyInputsObj = Object.assign({}, this.currencyInputs);
        const currentSupported = Object.assign({}, this.supportedCoins);
        Object.keys(currentSupported).forEach(item => {
          if (
            currencyInputsObj[item] &&
            currentSupported[item].value !== currencyInputsObj[item].value
          ) {
            changed.push(currencyInputsObj[item]);
          }
        });
        if (changed.length > 0) {
          this.setMultiCoin(changed);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ManageENSContainer.scss';
</style>
