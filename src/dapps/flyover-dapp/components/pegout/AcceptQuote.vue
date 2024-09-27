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
          :disabled="loading || !token"
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
import { abi } from '../../handlers/helpers/bridgeContract';
import { decodeBtcAddress } from '../../handlers/helpers/btc';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AppCopyBtn from '@/core/components/AppCopyBtn';
import { mapState } from 'vuex';
import { ethers, Contract, utils } from 'ethers';

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
    },
    quoteResponse: {
      default() {
        return {};
      },
      type: Object
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
      this.msg = '';
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

        const amountToSend = ethers.utils.parseEther(this.quoteAmount);
        const amountInWei = ethers.utils.parseUnits(this.quoteAmount, 'ether');

        // create signer
        const ethersProvider = new ethers.providers.Web3Provider(
          this.web3.currentProvider
        );
        const signer = ethersProvider.getSigner();

        // Create bridge contract
        const bridgeContract = new Contract(quoteReply.lbcAddress, abi, signer);

        // Create depositPegout contract payload
        const signatureBytes = utils.arrayify('0x' + quoteReply.signature);

        const lbcPegoutQuote = {
          lbcAddress: this.quoteResponse.lbcAddress,
          lpRskAddress: this.quoteResponse.liquidityProviderRskAddress,
          btcRefundAddress: decodeBtcAddress(
            this.quoteResponse.btcRefundAddress
          ),
          rskRefundAddress: this.quoteResponse.rskRefundAddress,
          lpBtcAddress: decodeBtcAddress(this.quoteResponse.lpBtcAddr),
          callFee: String(this.quoteResponse.callFee),
          penaltyFee: String(this.quoteResponse.penaltyFee),
          nonce: String(this.quoteResponse.nonce),
          deposityAddress: decodeBtcAddress(this.quoteResponse.depositAddr),
          value: String(this.quoteResponse.value),
          agreementTimestamp: this.quoteResponse.agreementTimestamp,
          depositDateLimit: this.quoteResponse.depositDateLimit,
          depositConfirmations: this.quoteResponse.depositConfirmations,
          transferConfirmations: this.quoteResponse.transferConfirmations,
          transferTime: this.quoteResponse.transferTime,
          expireDate: this.quoteResponse.expireDate,
          expireBlock: this.quoteResponse.expireBlocks
        };

        // Create a transaction object
        const transactionObject = {
          to: quoteReply.lbcAddress,
          value: amountToSend
        };

        const gasLimit = await wallet.estimateGas(transactionObject);
        const gasPrice = await ethersProvider.getGasPrice();
        const transactionCost = gasLimit.mul(gasPrice);
        const balance = await wallet.getBalance();

        // Account must have enough balance for the transaction
        if (balance.lt(amountToSend.add(transactionCost))) {
          this.msg = 'Insufficient balance to send the transaction.';
        } else {
          this.wait = true;
          const transactionResponse = await bridgeContract.depositPegout(
            lbcPegoutQuote,
            signatureBytes,
            { value: amountInWei }
          );

          this.hash = `https://explorer.rootstock.io/tx/${transactionResponse.hash}`;
          // Wait for transaction confirmation
          await transactionResponse.wait();
          this.wait = false;
          quoteReply.hash = this.hash;
          this.$emit('onSubmit', quoteReply);
        }
      } catch (e) {
        Toast(e, {}, ERROR);
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
