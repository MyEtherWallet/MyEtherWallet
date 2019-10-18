<template lang="html">
  <div class="already-owned-container">
    <h3>{{ fullDomainName }} {{ $t('dapps.alreadyOwned') }}.</h3>
    <div class="content-container">
      <p class="label">{{ $t('dapps.labelHash') }}({{ hostName }}):</p>
      <p class="content">{{ labelHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('dapps.nameHash') }}({{ fullDomainName }}):</p>
      <p class="content">{{ nameHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('dapps.owner') }}:</p>
      <p class="content">{{ owner }}</p>
    </div>
    <h4>{{ $t('dapps.multiCoin') }}.</h4>
    <div
      v-for="(v, k) in supportedCoins"
      v-if="v.value"
      :key="k.id"
      class="content-container"
    >
      <p class="label">{{ v.name }} address:</p>
      <p class="content">{{ v.value }}</p>
    </div>
    <div class="owner-options">
      <button
        v-if="owner.toLowerCase() === account.address.toLowerCase()"
        class="manage-button"
        @click="manageEns"
      >
        {{ $t('dapps.manage') }}
      </button>
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
import supportedCoins from '../../supportedCoins';

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
    }
  },
  data() {
    return {
      supportedCoins
    };
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
