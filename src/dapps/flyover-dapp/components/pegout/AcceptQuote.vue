<template>
  <div>
    <!-- amount -->
    <div class="field-card">
      <div class="field-label">{{ t('flyover.pegout.accept.amount') }}</div>
      <div class="field-value">
        <p class="field-text">{{ String(quoteAmount) }}</p>

        <app-copy-btn :copy-value="String(quoteAmount)">
          <v-btn x-small icon color="greenPrimary">
            <img
              src="@/assets/images/icons/icon-copy-green.svg"
              alt="copy"
              height="13"
            />
          </v-btn>
        </app-copy-btn>
      </div>
    </div>
    <!-- confirmations -->
    <div class="field-card">
      <div class="field-label">
        {{ t('flyover.pegout.accept.confirmations') }}
      </div>
      <div class="field-value">
        <p class="field-text">{{ String(confirmations) }}</p>

        <app-copy-btn :copy-value="String(confirmations)">
          <v-btn x-small icon color="greenPrimary">
            <img
              src="@/assets/images/icons/icon-copy-green.svg"
              alt="copy"
              height="13"
            />
          </v-btn>
        </app-copy-btn>
      </div>
    </div>

    <!-- hash -->
    <div class="field-card">
      <div class="field-label">{{ t('flyover.pegout.accept.hash') }}</div>
      <div class="field-value">
        <p class="field-text">{{ String(quoteHash) }}</p>

        <app-copy-btn :copy-value="quoteHash">
          <v-btn x-small icon color="greenPrimary">
            <img
              src="@/assets/images/icons/icon-copy-green.svg"
              alt="copy"
              height="13"
            />
          </v-btn>
        </app-copy-btn>
      </div>
    </div>

    <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="siteKey"></div>

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
          :title="t('flyover.pegout.accept.acceptBtn')"
          @click.native="submit"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, defineEmits } from 'vue';
import { ethers } from 'ethers';

import { acceptQuote } from '../../handlers/pegout';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AppCopyBtn from '@/core/components/AppCopyBtn';
import { toBase } from '@/core/helpers/unit';
import { useWalletStore } from '@/core/store/wallet';

import { useI18n } from 'vue-i18n-composable';

// emits
const emit = defineEmits(['onSubmit']);

// injections/use
const { web3 } = useWalletStore();
const { t } = useI18n();

// props
const props = defineProps({
  siteKey: {
    default: '',
    type: String
  },
  quoteUrl: {
    default: '',
    type: String
  },
  quoteAmount: {
    default: 0,
    type: Number
  },
  confirmations: {
    default: 0,
    type: Number
  },
  quoteHash: {
    default: '',
    type: String
  }
});

// data
const msg = ref('');
const loading = ref(false);
const wait = ref(false);
const token = ref('');
const hash = ref('');

// mounted
onMounted(() => {
  if (window.grecaptcha) {
    window.grecaptcha.render('g-recaptcha', {
      sitekey: props.siteKey,
      callback: response => {
        token.value = response;
      }
    });
  }
});

// methods
const submit = async () => {
  const ethersProvider = new ethers.providers.Web3Provider(
    web3.value.currentProvider
  );
  const wallet = ethersProvider.getSigner();
  loading.value = true;
  try {
    const quoteReply = await acceptQuote(
      props.quoteUrl,
      {
        QuoteHash: props.quoteHash
      },
      {
        'X-Captcha-Token': token
      }
    );

    // Create a transaction object
    const transactionObject = {
      to: quoteReply.lbcAddress,
      value: toBase(props.quoteAmount, 18)
    };

    wait.value = true;

    const transactionResponse = await wallet.sendTransaction(transactionObject);

    hash.value = `https://explorer.rsk.co/tx/${transactionResponse.hash}`;
    // Wait for transaction confirmation
    await transactionResponse.wait();
    wait.value = false;
    quoteReply.hash = hash;
    emit('onSubmit', quoteReply);
  } catch (e) {
    Toast(e, {}, ERROR);
  }
  loading.value = false;
};
</script>
<style lang="scss" scoped>
.api-error {
  color: #ff445b;
  font-size: 12px;
  margin-top: 25px;
}
.field-card {
  margin-bottom: 10px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: none;
  padding: 1rem;
  background-color: #f2f4fa;
  border-radius: 10px;
  overflow: auto;
  .field-label {
    color: rgb(144, 136, 154);
  }
  .field-value {
    display: flex;
    justify-content: space-between;
    .field-text {
      color: black;
    }
  }
}
</style>
