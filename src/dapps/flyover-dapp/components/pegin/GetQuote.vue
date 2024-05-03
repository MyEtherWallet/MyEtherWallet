<template>
  <div>
    <mew-select
      :has-filter="false"
      :label="t('flyover.pegin.provider')"
      :items="providers"
      normal-dropdown
      class="mr-3 flex-grow-1 mb-4"
      @input="setProvider"
    />

    <mew-input
      v-model="rskAddress"
      :has-clear-btn="false"
      :label="t('flyover.pegin.quote.rskAddress')"
      :placeholder="t('flyover.pegin.quote.rskAddress')"
      class="mr-3 flex-grow-1"
    />

    <mew-input
      v-model="btcAddress"
      :has-clear-btn="false"
      :label="t('flyover.pegin.quote.btcAddress')"
      :placeholder="t('flyover.pegin.quote.btcAddress')"
      class="mr-3 flex-grow-1"
    />

    <div class="btc-amount">
      <mew-input
        v-model="amount"
        :has-clear-btn="false"
        :label="t('flyover.pegin.quote.amountBTC')"
        :placeholder="t('flyover.pegin.quote.amountBTC')"
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
          :title="t('flyover.pegin.quote.quoteBtn')"
          @click.native="fetchQuote"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getQuote } from '../../handlers/pegin';
import { fromBase, toBase } from '@/core/helpers/unit';
import { getProviders, getDetails } from '../../handlers/helpers/provider';
import { useWalletStore } from '@/core/store/wallet';

import { useI18n } from 'vue-i18n-composable';

// emits
const emit = defineEmits(['onSubmit']);

// injections
const { instance } = useWalletStore();
const { t } = useI18n();

// data
const msg = ref('');
const loading = ref(false);
const amount = ref('0.005');
const rskAddress = ref(null);
const btcAddress = ref('');
const provider = ref(null);
const providers = ref([]);
const amountNote = ref('');
const siteKey = ref('');

// onMounted
onMounted(() => {
  msg.value = '';
  getDetails()
    .then(data => {
      siteKey.value = data.siteKey;
      const max = fromBase(parseFloat(data.pegin.maxTransactionValue), 18);
      const min = fromBase(parseFloat(data.pegin.minTransactionValue), 18);
      amountNote.value = `min: ${min}, max: ${max} btc`;
    })
    .catch(() => {
      msg.value = 'No liquidity providers available!';
    });

  getProviders()
    .then(data => {
      rskAddress.value = instance.getAddressString();
      providers.value = data.map(provider => {
        return {
          ...provider,
          name: `${provider.name}-(${provider.providerType})`
        };
      });
    })
    .catch(() => {
      msg.value = 'No liquidity providers available!';
    });
});

// methods
const fetchQuote = async () => {
  loading.value = true;
  msg.value = '';
  const payload = {
    callEoaOrContractAddress: instance.getAddressString(),
    bitcoinRefundAddress: btcAddress.value,
    rskRefundAddress: rskAddress.value,
    valueToTransfer: parseFloat(toBase(parseFloat(amount.value), 18)),
    callContractArguments: ''
  };

  try {
    const quoteReply = await getQuote(provider, payload);

    if (quoteReply.length == 0) {
      msg.value = 'No quote to accept';
    } else {
      emit('onSubmit', {
        ...quoteReply[0],
        quoteUrl: provider,
        siteKey: siteKey.value
      });
    }
  } catch (e) {
    let detail = '';
    if (e.details && e.details.maxValueTotransfer) {
      detail = fromBase(e.details.maxValueTotransfer, 18);
    }

    msg.value = `${e.message} ${detail}`;
  }
  loading.value = false;
};
const setProvider = provider => {
  if (provider) {
    provider = provider.apiBaseUrl;
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
