<template>
  <div>
    <mew-select
      :has-filter="false"
      :label="t('flyover.pegout.provider')"
      :items="providers"
      normal-dropdown
      class="mr-3 flex-grow-1 mb-4"
      @input="setProvider"
    />

    <mew-input
      :value="btcAddress"
      :has-clear-btn="false"
      :label="t('flyover.pegout.quote.btcAddress')"
      :placeholder="t('flyover.pegout.quote.btcAddress')"
      class="mr-3 flex-grow-1"
      @input="setBtcAddress"
    />

    <mew-input
      v-model="btcRefund"
      :has-clear-btn="false"
      :label="t('flyover.pegout.quote.btcRefund')"
      :placeholder="t('flyover.pegout.quote.btcRefund')"
      class="mr-3 flex-grow-1"
    />

    <mew-input
      :value="rskAddress"
      :has-clear-btn="false"
      :label="t('flyover.pegout.quote.rskAddress')"
      :placeholder="t('flyover.pegout.quote.rskAddress')"
      class="mr-3 flex-grow-1"
      @input="setRskAddress"
    />

    <div class="btc-amount">
      <mew-input
        v-model="amount"
        :has-clear-btn="false"
        :label="t('flyover.pegout.quote.amountBTC')"
        :placeholder="t('flyover.pegout.quote.amountBTC')"
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
          :title="t('flyover.pegout.quote.quoteBtn')"
          @click.native="fetchQuote"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';

import { getQuote } from '../../handlers/pegout';
import { getProviders, getDetails } from '../../handlers/helpers/provider';
import { fromBase, toBase } from '@/core/helpers/unit';

import { wallet as useWalletStore } from '@/core/store/index.js';
import { useI18n } from 'vue-i18n-composable';

// emit
const emit = defineEmits(['onSubmit']);

// injections/use
const { instance } = useWalletStore();
const { t } = useI18n();

// data
const msg = ref('');
const loading = ref(false);
const amount = ref('0.005');
const rskAddress = ref(null);
const btcAddress = ref('');
const btcRefund = ref('');
const provider = ref(null);
const providers = ref([]);
const amountNote = ref('');
const siteKey = ref('');

// mounted
onMounted(() => {
  getDetails()
    .then(data => {
      siteKey.value = data.siteKey;
      const max = fromBase(parseFloat(data.pegout.maxTransactionValue), 18);
      const min = fromBase(parseFloat(data.pegout.minTransactionValue), 18);
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
    bitcoinRefundAddress: btcRefund,
    rskRefundAddress: rskAddress,
    to: btcAddress,
    valueToTransfer: parseFloat(toBase(parseFloat(amount), 18))
  };

  try {
    const quoteReply = await getQuote(provider, payload);
    if (quoteReply.length == 0) {
      msg.value = 'No quote to accept';
    } else {
      emit('onSubmit', {
        ...quoteReply[0],
        quoteUrl: provider,
        siteKey: siteKey
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
const setProvider = prv => {
  if (prv) {
    provider.value = provider.value.apiBaseUrl;
  }
};
const setRskAddress = addr => {
  rskAddress.value = addr;
};
const setBtcAddress = addr => {
  btcAddress.value = addr;
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
