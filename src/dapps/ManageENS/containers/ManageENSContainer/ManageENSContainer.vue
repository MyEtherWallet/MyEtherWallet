<template>
  <div class="manage-ens-container">
    <h3>{{ $t('dapps.manage') }} {{ domainName }}</h3>
    <div class="inputs-container">
      <div v-for="(v, k) in supportedCoins" :key="k.id" class="form-container">
        <form class="manage-form">
          <div class="input-container">
            <label for="updateResolver">{{ k }}:</label>
            <input
              v-model="v.value"
              :placeholder="v.name + ' address'"
              type="text"
              name="updateResolver"
            />
          </div>
          <div class="submit-container">
            <button
              :class="
                !v.value || !MultiCoinValidator.validate(v.value, v.validator)
                  ? 'disabled'
                  : ''
              "
              type="submit"
              @click.prevent="setMultiCoin(v)"
            >
              Update
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
import supportedCoins from '../../supportedCoins';
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
    }
  },
  data() {
    return {
      transferTo: '',
      isAddress: isAddress,
      supportedCoins,
      MultiCoinValidator
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  mounted() {
    if (this.domainName === '.') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ManageENSContainer.scss';
</style>
