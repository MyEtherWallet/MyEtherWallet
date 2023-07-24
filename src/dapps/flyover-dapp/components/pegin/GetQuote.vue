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
      :label="$t('flyover.pegin.quote.rskAddress')"
      :placeholder="$t('flyover.pegin.quote.rskAddress')"
      class="mr-3 flex-grow-1"
    />

    <mew-input
      v-model="btcAddress"
      :has-clear-btn="false"
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
        class="mr-3 flex-grow-1"
      />
      <div class="notes">{{ amountNote }}</div>
    </div>

    <v-row class="mx-0">
      <v-col class="pr-0" cols="8">
        <div class="api-error">{{ msg }}</div>
      </v-col>
      <v-col class="pl-0" cols="4">
        <div
          class="g-recaptcha"
          data-sitekey="6Lc5ZdAoAAAAAPralWgHZ5ma8ri_xE6g2YN_Obpc"
        ></div>

        <mew-button
          :loading="loading"
          :disabled="loading"
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
import { getProviders, getDetails } from '../../handlers/helpers/provider';

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
      siteKey: ''
    };
  },
  computed: {
    ...mapState('wallet', ['instance'])
  },
  mounted() {
    this.msg = '';
    getDetails()
      .then(data => {
        this.siteKey = data.siteKey;
        const max = parseFloat(data.pegin.maxTransactionValue) / 10 ** 18;
        const min = parseFloat(data.pegin.minTransactionValue) / 10 ** 18;
        this.amountNote = `min: ${min}, max: ${max} btc`;
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
        valueToTransfer: parseFloat(this.amount) * 10 ** 18,
        callContractArguments: ''
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
          detail = e.details.maxValueTotransfer / 10 ** 18;
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
