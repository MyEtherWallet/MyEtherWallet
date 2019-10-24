<template lang="html">
  <div class="already-owned-container">
    <h3>{{ $t('ens.already-owned', { domain: fullDomainName }) }}</h3>
    <div class="content-container">
      <p class="label">{{ $t('ens.label-hash') }}({{ hostName }}):</p>
      <p class="content">{{ labelHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('ens.name-hash') }}({{ fullDomainName }}):</p>
      <p class="content">{{ nameHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('ens.owner') }}:</p>
      <p class="content">{{ owner }}</p>
    </div>
    <div v-show="resolverMultiCoinSupport" class="content-container">
      <h4>{{ $t('dapps.multiCoin') }}:</h4>
      <div v-for="(v, k) in supportedCoins" v-if="v.value" :key="k.id">
        <span class="currency"
          >{{ v.symbol }} {{ $t('common.lowercase-addr') }}:
        </span>
        <span class="content">{{ v.value }}</span>
      </div>
    </div>
    <div class="owner-options">
      <button
        v-if="owner.toLowerCase() === account.address.toLowerCase()"
        class="manage-button"
        @click="manageEns"
      >
        {{ $t('ens.manage') }}
      </button>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';

import { mapState } from 'vuex';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    labelHash: {
      type: String,
      default: ''
    },
    nameHash: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: ''
    },
    hostName: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: ''
    },
    supportedCoins: {
      type: Object,
      default: function() {}
    },
    resolverMultiCoinSupport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(['account']),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    }
  },
  mounted() {
    if (this.hostName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  },
  methods: {
    manageEns() {
      this.$router.push('manage');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AlreadyOwnedENSContainer.scss';
</style>
