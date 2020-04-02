<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>{{ $t('ens.commit.is-available', { domain: fullDomainName }) }}</h3>
      <p>{{ $t('ens.commit.register-domain', { domain: fullDomainName }) }}</p>
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
          @click="createCommitment"
        >
          <span v-show="!loading">
            {{ $t('ens.register') }}
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
        <span v-show="info.disable"> {{ $t(info.msg) }} </span>
      </div>
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
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCommitmentContainer.scss';
</style>
