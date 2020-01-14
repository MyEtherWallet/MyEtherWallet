<template>
  <div class="manage-ens-container">
    <h3>{{ $t('ens.manage') }} {{ domainName }}</h3>
    <b-btn
      v-show="resolverMultiCoinSupport"
      v-b-toggle.multicoinsec
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.multi-coin') }}</p>
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
                v.value !== '' && !v.validator.validate(v.value)
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
              :class="isValidAddresses ? '' : 'disabled'"
              @click.prevent="checkAndSendCurrency"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <b-btn
      v-show="resolverTxtSupport"
      v-b-toggle.textrecords
      class="collapse-open-button"
      variant="primary"
    >
      <p>{{ $t('ens.txt-record') }}</p>
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
          <div
            v-for="(v, k) in txtRecordInputs"
            :key="k.id"
            class="multi-coin-input-container"
          >
            <label for="updateResolver">{{ k | capitalize }}:</label>
            <input
              v-model="txtRecordInputs[k]"
              v-validate="getValidation(k)"
              :placeholder="k | capitalize"
              :name="k"
              type="text"
            />
            <i
              :class="[
                'validity-indication fa',
                !!txtRecordInputs[k] &&
                txtRecordInputs[k] !== '' &&
                !errors.hasOwnProperty(`${k}`)
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
          <div class="multi-coin-submit-container">
            <button
              :class="validTextRecords ? 'disabled' : ''"
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
              :class="!isAddress(transferTo) ? 'disabled' : ''"
              type="submit"
              @click.prevent="transferDomain(transferTo)"
            >
              {{ $t('ens.transfer') }}
            </button>
          </div>
        </form>
      </div>
    </b-collapse>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://kb.myetherwallet.com"
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
      default: function() {}
    },
    setRecord: {
      type: Function,
      default: function() {}
    },
    transferDomain: {
      type: Function,
      default: function() {}
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
      default: function() {}
    },
    txtRecords: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    const newCoinsCopy = this.copySupported();
    const newtxtRecords = {};
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
      txtRecordInputs: newtxtRecords
    };
  },
  computed: {
    ...mapState(['web3']),
    isValidAddresses() {
      console.error('currencyInputs', this.currencyInputs)
      for (const type in this.currencyInputs) {
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
        if (this.txtRecordInputs[type] && this.txtRecordInputs[type] !== '')
          return false;
      }
      return true;
    }
  },
  watch: {
    currencyInputs: {
      handler: function(newVal) {
        this.currencyInputs = newVal;
      },
      deep: true
    },
    txtRecordInputs: {
      handler: function(newVal) {
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
    getValidation(name) {
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
          `Currency ${item} is already added for ${this.domainName}`,
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
          `Text Record ${item} input is already added for ${this.domainName}`,
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
    },
    checkAndSendCurrency() {
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
};
</script>
<style lang="scss" scoped>
@import 'ManageENSContainer.scss';
</style>
