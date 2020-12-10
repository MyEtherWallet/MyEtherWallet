<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>
        {{
          isCommitment
            ? $t('ens.commit.is-available', { domain: fullDomainName })
            : isExpired
            ? `${fullDomainName} is expired!`
            : fullDomainName
        }}
      </h3>
      <p>
        {{
          isCommitment
            ? $t('ens.commit.register-domain', { domain: fullDomainName })
            : `Do you wanna renew ${fullDomainName} ?`
        }}
      </p>
      <div class="secret-phrase-container">
        <label for="range-slider">{{ $t('ens.commit.how-many-years') }}</label>
        <b-form-input
          id="range-slider"
          v-model="duration"
          type="range"
          min="1"
          max="20"
          step="1"
        />
        <div>
          {{
            duration > 1
              ? $tc('ens.commit.year', 2, { duration: duration })
              : $tc('ens.commit.year', 1)
          }}
        </div>
        <div
          v-if="network.type.name === 'ETH'"
          class="estimate-price-container"
        >
          Estimated bid price: {{ estimatedPrice.ethAmount }}
          {{ network.type.currencyName }} (${{ estimatedPrice.usd }})
        </div>
      </div>
      <div class="transfer-registrar-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : '',
            info.disable ? 'disabled' : ''
          ]"
          @click="funcCall"
        >
          <span v-show="!loading">
            {{ isCommitment ? $t('ens.register') : 'Renew' }}
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
        <span v-show="info.disable"> {{ $t(info.msg) }} </span>
      </div>
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
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    hostName: {
      type: String,
      default: ''
    },
    createCommitment: {
      type: Function,
      default: function () {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    tld: {
      type: String,
      default: ''
    },
    usd: {
      type: Number,
      default: 0
    },
    renewName: {
      type: Function,
      default: function () {}
    },
    isExpired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      duration: '1'
    };
  },
  computed: {
    ...mapState('main', ['account', 'network']),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    pricingByLength() {
      if (this.hostName.length === 3) {
        return 640;
      } else if (this.hostName.length === 4) {
        return 160;
      }

      return 5;
    },
    estimatedPrice() {
      const ethAmount = new BigNumber(this.pricingByLength)
        .dividedBy(this.usd)
        .times(this.duration)
        .toFixed(2);

      const usd = new BigNumber(this.pricingByLength).times(this.duration);

      return {
        usd: usd,
        ethAmount: ethAmount
      };
    },
    info() {
      const balance = this.account.balance;
      if (balance === '0') {
        return {
          disable: true,
          msg: 'ens.commit.no-balance'
        };
      }
      return {
        disable: false,
        msg: ''
      };
    },
    isCommitment() {
      return this.$router.currentRoute.path.includes('create-commitment');
    }
  },
  watch: {
    duration(newVal) {
      this.$emit('updateDuration', Number(newVal));
    }
  },
  mounted() {
    if (this.hostName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  },
  methods: {
    funcCall() {
      if (this.isCommitment) {
        this.createCommitment();
      } else {
        this.renewName();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCommitmentContainer.scss';
</style>
