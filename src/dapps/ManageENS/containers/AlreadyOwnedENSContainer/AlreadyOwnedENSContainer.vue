<template lang="html">
  <div class="already-owned-container">
    <h3>{{ $t('ens.already-owned', { domain: fullDomainName }) }}</h3>
    <div v-if="hasAvatar" class="container-with-avatar content-container">
      <div class="img-info-container">
        <div class="profile-img">
          <img :src="convertedAvatar" />
        </div>
        <div class="profile-info">
          <p v-if="txtRecordsWithValue['url']">
            Website:
            <a :href="'mailto:' + txtRecordsWithValue['url']" target="_blank">
              {{ txtRecordsWithValue['url'] }}
            </a>
          </p>
          <p v-if="txtRecordsWithValue['email']">
            Email:
            <a :href="'mailto:' + txtRecordsWithValue['email']" target="_blank">
              {{ txtRecordsWithValue['email'] }}
            </a>
          </p>
          <p v-if="txtRecordsWithValue['vnd.twitter']">
            Twitter:
            <a
              :href="
                'https://twitter.com/' + txtRecordsWithValue['vnd.twitter']
              "
              target="_blank"
            >
              {{ txtRecordsWithValue['vnd.twitter'] }}
            </a>
          </p>
          <p v-if="txtRecordsWithValue['vnd.github']">
            Github:
            <a
              :href="'https://github.com/' + txtRecordsWithValue['vnd.github']"
              target="_blank"
            >
              {{ txtRecordsWithValue['vnd.github'] }}
            </a>
          </p>
          <p v-if="txtRecordsWithValue['vnd.peepeth']">
            Peepeth:
            <a
              :href="
                'https://peepeth.com/' + txtRecordsWithValue['vnd.peepeth']
              "
              target="_blank"
            >
              {{ txtRecordsWithValue['vnd.peepeth'] }}
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('ens.label-hash') }}({{ hostName }}):</p>
      <p class="content">{{ labelHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('ens.name-hash') }}({{ fullDomainName }}):</p>
      <p class="content">{{ nameHash }}</p>
    </div>
    <div v-if="contentHash && contentHash !== ''" class="content-container">
      <p class="label">Content Hash({{ hostName }}):</p>
      <p class="content">{{ contentHash }}</p>
    </div>
    <div class="content-container">
      <p class="label">{{ $t('ens.owner') }}:</p>
      <p class="content">{{ owner }}</p>
    </div>
    <div v-if="hasDeed && isDeedOwner" class="content-container deed-container">
      <div>
        <p class="label">Deed Value:</p>
        <p class="content">{{ deedValueEth }} {{ network.type.name }}</p>
      </div>
      <div class="submit-container">
        <button
          type="submit"
          class="redeem-button"
          @click.prevent="releaseDeed()"
        >
          {{ $t('ens.release-deed') }}
        </button>
      </div>
    </div>
    <div v-show="resolverMultiCoinSupport" class="content-container">
      <h4>{{ $t('ens.multi-coin') }}:</h4>
      <div v-for="(v, k) in supportedCoinsWithValue" :key="k.id">
        <span class="currency"
          >{{ v.symbol }} {{ $t('common.lowercase-addr') }}:
        </span>
        <span class="content">{{ v.value }}</span>
      </div>
    </div>
    <div v-show="hasAnyTxt" class="content-container">
      <h4>{{ $t('ens.txt-record') }}:</h4>
      <div v-for="(value, key) in txtRecordsWithValue" :key="key">
        <span class="currency">{{ key }}: </span>
        <span class="content">{{ value }}</span>
      </div>
    </div>
    <div class="owner-options">
      <button
        v-if="
          owner.toLowerCase() === account.address.toLowerCase() && !isExpired
        "
        class="manage-button"
        @click="manageEns"
      >
        {{ $t('ens.manage') }}
      </button>
      <button
        v-if="!isSubDomain"
        class="manage-button renew"
        @click="navigateToRenew"
      >
        {{ $t('ens.renew') }}
      </button>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://howto.xinfin.org/XinFinWallet/features"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { fromWei } from 'web3-utils';
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
    isSubDomain: {
      type: Boolean,
      default: false
    },
    tld: {
      type: String,
      default: ''
    },
    supportedCoins: {
      type: Object,
      default: () => {}
    },
    resolverMultiCoinSupport: {
      type: Boolean,
      default: false
    },
    txtRecords: {
      type: Object,
      default: () => {}
    },
    isExpired: {
      type: Boolean,
      default: false
    },
    navigateToRenew: {
      type: Function,
      default: () => {}
    },
    deedValue: {
      type: String,
      default: '0'
    },
    hasDeed: {
      type: Boolean,
      default: false
    },
    isDeedOwner: {
      type: Boolean,
      default: false
    },
    releaseDeed: {
      type: Function,
      default: () => {}
    },
    contentHash: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      locAvatar: ''
    };
  },
  computed: {
    ...mapState('main', ['account', 'network']),
    deedValueEth() {
      return fromWei(this.deedValue, 'ether');
    },
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    supportedCoinsWithValue() {
      const coins = {};
      for (const k in this.supportedCoins)
        if (this.supportedCoins[k].value) coins[k] = this.supportedCoins[k];
      return coins;
    },
    convertedAvatar() {
      if (this.hasAvatar) {
        return `https://img.mewapi.io/?image=${this.txtRecordsWithValue.avatar}&width=75&height=75&fit=scale-down`;
      }
      return '';
    },
    hasAvatar() {
      return this.txtRecordsWithValue.hasOwnProperty('avatar');
    },
    txtRecordsWithValue() {
      const txtRecords = {};
      for (const k in this.txtRecords)
        if (this.txtRecords[k]) txtRecords[k] = this.txtRecords[k];
      return txtRecords;
    },
    hasAnyTxt() {
      for (const i in this.txtRecords) {
        if (this.txtRecords[i] !== '') {
          return true;
        }
      }
      return false;
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
