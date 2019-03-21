<template>
  <div class="manage-ens-container">
    <h3>{{ $t('dapps.manage') }} {{ domainName }}</h3>
    <div class="inputs-container">
      <div class="form-container">
        <form class="manage-form">
          <div class="input-container">
            <label for="updateResolver"
              >{{ $t('dapps.updateResolver') }}:</label
            >
            <input
              v-model="locResolverAddr"
              type="text"
              name="updateResolver"
              placeholder="0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D"
            />
          </div>
          <div class="submit-container">
            <button
              :class="!isAddress(locResolverAddr) ? 'disabled' : ''"
              type="submit"
              @click.prevent="updateResolver(locResolverAddr)"
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
import { mapGetters } from 'vuex';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    updateResolver: {
      type: Function,
      default: function() {}
    },
    transferDomain: {
      type: Function,
      default: function() {}
    },
    resolverAddress: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locResolverAddr: this.resolverAddress,
      transferTo: '',
      isAddress: isAddress
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3'
    })
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
