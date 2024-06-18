<template>
  <div>
    <!-- amount -->
    <div class="field-card">
      <div class="field-label">{{ $t('flyover.pegin.accept.amount') }}</div>
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
        {{ $t('flyover.pegin.accept.confirmations') }}
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
      <div class="field-label">{{ $t('flyover.pegin.accept.hash') }}</div>
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
          :title="$t('flyover.pegin.accept.acceptBtn')"
          @click.native="submit"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { acceptQuote } from '../../handlers/pegin';
import AppCopyBtn from '@/core/components/AppCopyBtn';

// emits
const emits = defineEmits(['onSubmit']);

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
const token = ref('');
const loading = ref(false);
const widgetId = ref(null);

// mounted
onMounted(() => {
  if (window.grecaptcha) {
    widgetId.value = window.grecaptcha.render('g-recaptcha', {
      sitekey: props.siteKey,
      callback: response => {
        token.value = response;
      }
    });
  }
});

// methods
const submit = async () => {
  msg.value = '';
  loading.value = true;
  try {
    const quoteReply = await acceptQuote(
      props.quoteUrl,
      {
        QuoteHash: props.quoteHash
      },
      {
        'X-Captcha-Token': token.value
      }
    );

    emits('onSubmit', quoteReply);
  } catch (e) {
    msg.value = `${e.message}`;
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
