<template>
  <div>
    <!-- amount -->
    <div class="field-card">
      <div class="field-label">{{ $t('flyover.pegout.accept.amount') }}</div>
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
        {{ $t('flyover.pegout.accept.confirmations') }}
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
      <div class="field-label">{{ $t('flyover.pegout.accept.hash') }}</div>
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
          :title="$t('flyover.pegout.accept.acceptBtn')"
          @click.native="submit"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { acceptQuote } from '../../handlers/pegout';
import AppCopyBtn from '@/core/components/AppCopyBtn';
import { mapState } from 'vuex';
import { ethers } from 'ethers';

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
      loading: false,
      wait: false,
      token: '',
      hash: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance'])
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
      const ethersProvider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      const wallet = ethersProvider.getSigner();
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

        // Create a transaction object
        const transactionObject = {
          to: quoteReply.lbcAddress,
          value: this.quoteAmount * 10 ** 18
        };

        this.wait = true;

        const transactionResponse = await wallet.sendTransaction(
          transactionObject
        );

        this.hash = `https://explorer.rsk.co/tx/${transactionResponse.hash}`;
        // Wait for transaction confirmation
        await transactionResponse.wait();
        this.wait = false;
        quoteReply.hash = this.hash;
        this.$emit('onSubmit', quoteReply);
      } catch (e) {
        this.msg = `${e.message}`;
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
}
.field-card {
  margin-bottom: 10px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  box-shadow: none;
  padding: 1rem;
  background-color: rgb(241, 241, 241);
  border-radius: 10px;
  overflow: auto;
  .field-label {
    color: rgb(144, 136, 154);
  }
  .field-value {
    display: flex;
    justify-content: space-between;
  }
}
</style>
