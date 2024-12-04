<template>
  <div>
    <mew-select
      :has-filter="false"
      :label="$t('flyover.pegout.provider')"
      :items="providers"
      normal-dropdown
      class="mr-3 flex-grow-1 mb-4"
      @input="setProvider"
    />

    <mew-input
      :value="btcAddress"
      :has-clear-btn="false"
      :label="$t('flyover.pegout.quote.btcAddress')"
      :placeholder="$t('flyover.pegout.quote.btcAddress')"
      class="mr-3 flex-grow-1"
      @input="setBtcAddress"
    />

    <mew-input
      v-model="btcRefund"
      :has-clear-btn="false"
      :label="$t('flyover.pegout.quote.btcRefund')"
      :placeholder="$t('flyover.pegout.quote.btcRefund')"
      class="mr-3 flex-grow-1"
    />

    <mew-input
      :value="rskAddress"
      :has-clear-btn="false"
      :label="$t('flyover.pegout.quote.rskAddress')"
      :placeholder="$t('flyover.pegout.quote.rskAddress')"
      class="mr-3 flex-grow-1"
      @input="setRskAddress"
    />

    <div class="btc-amount">
      <mew-input
        v-model="amount"
        :has-clear-btn="false"
        :label="$t('flyover.pegout.quote.amountBTC')"
        :placeholder="$t('flyover.pegout.quote.amountBTC')"
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
          :disabled="loading"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('flyover.pegout.quote.quoteBtn')"
          @click.native="getQuote"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getQuote } from '../../handlers/pegout';
import { getProviders, getDetails } from '../../handlers/helpers/provider';
import { mapState } from 'vuex';
import { fromBase, toBase } from '@/core/helpers/unit';

export default {
  name: 'GetQuote',
  data() {
    return {
      msg: '',
      loading: false,
      amount: '0.005',
      rskAddress: null,
      btcAddress: '',
      btcRefund: '',
      provider: null,
      providers: [],
      amountNote: '',
      siteKey: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance'])
  },
  mounted() {
    getDetails()
      .then(data => {
        this.siteKey = data.siteKey;
        const max = fromBase(parseFloat(data.pegout.maxTransactionValue), 18);
        const min = fromBase(parseFloat(data.pegout.minTransactionValue), 18);
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
        bitcoinRefundAddress: this.btcRefund,
        rskRefundAddress: this.rskAddress,
        to: this.btcAddress,
        valueToTransfer: parseFloat(toBase(parseFloat(this.amount), 18))
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
    },
    setRskAddress(addr) {
      this.rskAddress = addr;
    },
    setBtcAddress(addr) {
      this.btcAddress = addr;
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
