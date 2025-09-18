<template>
  <div>
    <mew-select
      :has-filter="false"
      :label="$t('flyover.pegin.provider')"
      :items="providers"
      normal-dropdown
      class="mr-3 flex-grow-1 mb-4"
      @input="setProvider"
    />

    <mew-input
      v-model="rskAddress"
      :has-clear-btn="false"
      :rules="validateRskAddress"
      :label="$t('flyover.pegin.quote.rskAddress')"
      :placeholder="$t('flyover.pegin.quote.rskAddress')"
      class="mr-3 flex-grow-1"
    />

    <mew-input
      v-model="btcAddress"
      :has-clear-btn="false"
      :rules="validateBtcAddress"
      :label="$t('flyover.pegin.quote.btcAddress')"
      :placeholder="$t('flyover.pegin.quote.btcAddress')"
      class="mr-3 flex-grow-1"
    />

    <div class="btc-amount">
      <mew-input
        v-model="amount"
        :has-clear-btn="false"
        :label="$t('flyover.pegin.quote.amountBTC')"
        :placeholder="$t('flyover.pegin.quote.amountBTC')"
        :rules="validateAmount"
        class="mr-3 flex-grow-1"
      />
      <div class="notes">{{ amountNote }}</div>
    </div>

    <v-row class="mx-0">
      <v-col class="pr-0" cols="8">
        <div class="api-error">{{ msg }}</div>
      </v-col>
      <v-col class="pl-0" cols="4">
        <mew-button
          :loading="loading"
          :disabled="loading || disabled"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('flyover.pegin.quote.quoteBtn')"
          @click.native="getQuote"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getQuote } from '../../handlers/pegin';
import { mapState } from 'vuex';
import { fromBase, toBase } from '@/core/helpers/unit';
import { getProviders, getDetails } from '../../handlers/helpers/provider';
import {
  isAmountValid,
  isRootstockAddress,
  isLegacyBtcAddress
} from '../../handlers/helpers/validations';

export default {
  name: 'GetQuote',
  data() {
    return {
      msg: '',
      loading: false,
      amount: '0.005',
      rskAddress: null,
      btcAddress: '',
      provider: null,
      providers: [],
      amountNote: '',
      siteKey: '',
      min: 0,
      max: 0
    };
  },
  computed: {
    ...mapState('wallet', ['instance']),
    disabled() {
      return (
        !isAmountValid(this.amount, this.min, this.max) ||
        !isRootstockAddress(this.rskAddress) ||
        !isLegacyBtcAddress(this.btcAddress)
      );
    },
    validateAmount() {
      const valid = isAmountValid(this.amount, this.min, this.max);

      return [valid || `Required amount: ${this.amountNote}`];
    },
    validateRskAddress() {
      const valid = isRootstockAddress(this.rskAddress);

      return [valid || `Invalid rbtc address`];
    },
    validateBtcAddress() {
      const valid = isLegacyBtcAddress(this.btcAddress);

      return [valid || `Invalid btc legacy address`];
    }
  },
  mounted() {
    this.msg = '';
    getDetails()
      .then(data => {
        this.siteKey = data.siteKey;
        this.max = fromBase(parseFloat(data.pegin.maxTransactionValue), 18);
        this.min = fromBase(parseFloat(data.pegin.minTransactionValue), 18);
        this.amountNote = `min: ${this.min}, max: ${this.max} btc`;
      })
      .catch(() => {
        this.msg = 'No liquidity providers available!';
      });

    getProviders()
      .then(data => {
        this.rskAddress = this.instance.getAddressString();
        this.providers = data.map(provider => {
          return {
            ...provider,
            name: `${provider.name}-(${provider.providerType})`
          };
        });
      })
      .catch(() => {
        this.msg = 'No liquidity providers available!';
      });
  },
  methods: {
    async getQuote() {
      this.loading = true;
      this.msg = '';
      const payload = {
        callEoaOrContractAddress: this.instance.getAddressString(),
        bitcoinRefundAddress: this.btcAddress,
        rskRefundAddress: this.rskAddress,
        valueToTransfer: parseFloat(toBase(parseFloat(this.amount), 18)),
        callContractArguments: '0x'
      };

      try {
        const quoteReply = await getQuote(this.provider, payload);

        if (quoteReply.length == 0) {
          this.msg = 'No quote to accept';
        } else {
          this.$emit('onSubmit', {
            ...quoteReply[0],
            quoteUrl: this.provider,
            siteKey: this.siteKey
          });
        }
      } catch (e) {
        let detail = '';
        if (e.details && e.details.maxValueTotransfer) {
          detail = fromBase(e.details.maxValueTotransfer, 18);
        }

        this.msg = `${e.message} ${detail}`;
      }
      this.loading = false;
    },
    setProvider(provider) {
      if (provider) {
        this.provider = provider.apiBaseUrl;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.api-error {
  color: #ff445b;
  font-size: 12px;
}
.btc-amount {
  position: relative;
  .notes {
    position: absolute;
    right: 21px;
    bottom: 36px;
    font-size: 10px;
    font-style: italic;
  }
}
</style>
