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
          :disabled="loading || !token"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('flyover.pegin.accept.acceptBtn')"
          @click.native="submit"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { acceptQuote } from '../../handlers/pegin';
import AppCopyBtn from '@/core/components/AppCopyBtn';

export default {
  name: 'AcceptQuote',
  components: { AppCopyBtn },
  props: {
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
  },
  data() {
    return {
      msg: '',
      token: '',
      loading: false
    };
  },
  mounted() {
    if (window.grecaptcha) {
      this.widgetId = window.grecaptcha.render('g-recaptcha', {
        sitekey: this.siteKey,
        callback: response => {
          this.token = response;
        }
      });
    }
  },
  methods: {
    async submit() {
      this.msg = '';
      this.loading = true;
      try {
        const quoteReply = await acceptQuote(
          this.quoteUrl,
          {
            QuoteHash: this.quoteHash
          },
          {
            'X-Captcha-Token': this.token
          }
        );

        this.$emit('onSubmit', quoteReply);
      } catch (e) {
        this.msg = `${e.message}`;
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      }
      this.loading = false;
    }
  }
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
