<template>
  <div class="manage-ens-container">
    <h3>{{ $t('dapps.manage') }} {{ domainName }}</h3>
    <div class="inputs-container">
      <div v-show="resolverMultiCoinSupport" class="form-container">
        <form class="manage-multi-coin-form">
          <div class="title-and-dropdown-container">
            <h4>Multi-Coin:</h4>
            <b-dd :text="selectedCurrency" class="dropdown-button-2">
              <b-dd-item
                v-for="(item, idx) in Object.keys(supportedCoins)"
                :key="item + idx"
                @click="addInput(item)"
              >
                {{ item }}
              </b-dd-item>
            </b-dd>
          </div>
          <div
            v-for="(v, k) in inputs"
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
                v.value !== '' &&
                !MultiCoinValidator.validate(v.value, v.validator)
                  ? 'error fa-times-circle-o'
                  : 'valid fa-check-circle-o'
              ]"
            />
            <i
              class="fa fa-lg fa-times"
              @click="
                () => {
                  removeInput(k);
                }
              "
            />
          </div>
          <div class="multi-coin-submit-container">
            <button
              :class="isValidAddresses ? '' : 'disabled'"
              @click.prevent="checkAndSend"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <div class="form-container">
        <form class="manage-form">
          <div class="input-container">
            <label for="transferEns">{{ $t('dapps.transferEnsTo') }}:</label>
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
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.helpCenter')"
      :question="$t('interface.haveIssues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>
<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { isAddress } from '@/helpers/addressUtils';
import { mapState } from 'vuex';
import MultiCoinValidator from 'multicoin-address-validator';
import { Toast } from '@/helpers';
import utils from 'web3-utils';
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
    supportedCoins: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    const newObj = this.copySupported();
    for (const key in newObj) {
      if (newObj[key].hasOwnProperty('value') && newObj[key].value === '')
        delete newObj[key];
    }

    return {
      transferTo: '',
      multiCoinSupport: false,
      isAddress: isAddress,
      MultiCoinValidator,
      inputs: newObj,
      selectedCurrency: 'ETH',
      hasError: false
    };
  },
  computed: {
    ...mapState(['web3']),
    isValidAddresses() {
      for (const type in this.inputs) {
        if (
          this.inputs[type].value !== '' &&
          !MultiCoinValidator.validate(
            this.inputs[type].value,
            this.inputs[type].validator
          )
        )
          return false;
      }
      return true;
    }
  },
  watch: {
    inputs: {
      handler: function(newVal) {
        this.inputs = newVal;
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
    copySupported() {
      const newObj = utils._.map(this.supportedCoins, utils._.clone);
      const copiedObj = {};
      newObj.forEach(item => {
        copiedObj[item.symbol] = item;
      });

      return copiedObj;
    },
    addInput(item) {
      this.selectedCurrency = item;
      const unRefSupportedCoins = this.copySupported();
      const newObj = Object.assign({}, this.inputs);
      if (!newObj[item]) {
        newObj[item] = unRefSupportedCoins[item];
        this.inputs = newObj;
      } else {
        Toast.responseHandler(
          `Currency ${item} is already added for ${this.domainName}`,
          Toast.WARN
        );
      }
    },
    removeInput(name) {
      const newObj = Object.assign({}, this.inputs);
      newObj[name].value = '';
      this.inputs = newObj;
    },
    checkAndSend() {
      const changed = [];
      const inputsObj = Object.assign({}, this.inputs);
      const currentSupported = Object.assign({}, this.supportedCoins);
      Object.keys(currentSupported).forEach(item => {
        if (
          inputsObj[item] &&
          currentSupported[item].value !== inputsObj[item].value
        ) {
          changed.push(inputsObj[item]);
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
