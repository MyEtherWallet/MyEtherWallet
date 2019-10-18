<template>
  <div class="manage-ens-container">
    <h3>{{ $t('dapps.manage') }} {{ domainName }}</h3>
    <div class="inputs-container">
      <div class="form-container">
        <form class="manage-multi-coin-form">
          <h4>Multi-Coin: (ETH, ETC, LTC, BTC)</h4>
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
            <i :class="[v.value !== ''? 'disabled-icon': '', 'fa fa-lg fa-times']" @click="removeInput" />
          </div>
          <div class="multi-coin-submit-container">
            <button :class="[Object.keys(inputs).length === 4 ? 'disabled' : '', 'add']" @click.prevent="addInput">
              Add
            </button>
            <button @click.prevent="addInput">
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
    const newObj = {};
    Object.keys(this.supportedCoins).forEach(item => {
      if (this.supportedCoins[item].value !== '') {
        newObj[item] = this.supportedCoins[item];
      }
    });

    return {
      transferTo: '',
      multiCoinSupport: false,
      isAddress: isAddress,
      MultiCoinValidator,
      inputs: newObj
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  mounted() {
    // if (this.domainName === '.') {
    //   this.$router.push('/interface/dapps/manage-ens');
    // }
  },
  methods: {
    addInput() {
      const newObj = Object.assign({}, this.inputs);
      const currencies = ['ETH', 'ETC', 'LTC', 'BTC'];
      for (let i = 0; i < currencies.length; i++) {
        if (!newObj[currencies[i]]) {
          newObj[currencies[i]] = this.supportedCoins[currencies[i]];
          break;
        }
      }
      this.inputs = newObj;
    },
    removeInput() {

    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ManageENSContainer.scss';
</style>
