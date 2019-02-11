<template>
  <div class="send-currency-container-safe-send">
    <interface-container-title :title="$t('common.sendSafeSendTx')" />
    <div class="send-form">
      <div class="advanced-content safe-send-container">
        <div class="input-container">
          <div class="inner-safesend-text-container">
            <strong>
              <span class="inner-safesend-text">SafeSend</span>&nbsp;protects
              your transaction from fraud, phishing, and theft.
            </strong>
          </div>
          <br />
          <div>
            Simply send your transaction through this page and our fraud
            detection algorithms get to work. If we find that your destination
            address is likely to result in your money being stolen, your
            Ethereum will be sent back to you.
          </div>
        </div>
      </div>
    </div>
    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="title">
            <h4>Amount</h4>
            <p
              class="title-button prevent-user-select"
              @click="setBalanceToAmt"
            >
              Entire Balance
            </p>
          </div>

          <div class="the-form amount-number">
            <input
              :value="amount"
              type="number"
              step="any"
              placeholder="Amount"
              @input="debouncedAmount"
            />
            <i
              :class="[
                validAmount ? '' : 'not-good',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
          <div v-if="!validAmount" class="error-message-container">
            <p>{{ $t('common.dontHaveEnough') }}</p>
          </div>
        </div>
        <div class="to-address">
          <div class="title">
            <h4>
              To Address
              <blockie
                v-show="isValidAddress"
                :address="hexAddress"
                :size="8"
                :scale="16"
                width="32px"
                height="32px"
                class="blockie-image"
              />
            </h4>

            <p
              class="copy-button prevent-user-select"
              @click="copyToClipboard('address')"
            >
              {{ $t('common.copy') }}
            </p>
          </div>
          <div class="the-form address-block">
            <input
              v-ens-resolver="'address'"
              ref="address"
              v-model="address"
              type="text"
              name="name"
              autocomplete="off"
            />
            <i
              :class="[
                isValidAddress && hexAddress.length !== 0 ? '' : 'not-good',
                'fa fa-check-circle good-button'
              ]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <span class="minimum-amount-text"
        >Minimum amount: {{ minimumAmount }} ETH</span
      >
    </div>

    <div class="send-form">
      <div class="title-container">
        <div class="title">
          <div class="title-helper">
            <h4>{{ $t('common.speedTx') }}</h4>
            <popover :popcontent="$t('popover.whatIsSpeedOfTX')" />
          </div>
          <p>{{ $t('common.txFee') }}: {{ transactionFee }} ETH</p>
        </div>
        <div class="buttons">
          <div
            :class="[
              gasAmount === highestGas / 4 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="changeGas(highestGas / 4)"
          >
            {{ $t('common.slow') }}
          </div>
          <div
            :class="[
              gasAmount === highestGas / 2 ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="changeGas(highestGas / 2)"
          >
            {{ $t('common.regular') }}
          </div>
          <div
            :class="[
              gasAmount === highestGas ? 'active' : '',
              'small-circle-button-green-border'
            ]"
            @click="changeGas(highestGas)"
          >
            {{ $t('common.fast') }}
          </div>
        </div>
      </div>
      <div class="the-form gas-amount">
        <input v-model="gasAmount" type="number" placeholder="Gas Amount" />
        <div class="good-button-container">
          <p>Gwei</p>
          <i
            class="fa fa-check-circle good-button not-good"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
    <div class="submit-button-container">
      <div>
        <i
          :class="[
            validNetwork ? '' : 'not-good',
            'fa fa-check-circle good-button'
          ]"
          aria-hidden="true"
        />
        You must use the {{ chainIDEnglish }} network of your web3 provider
        (metamask, etc.) to use SafeSend.
      </div>
      <br />
      <div>
        Your estimated SafeSend Fee (in addition to gas):&nbsp;~{{
          safeSendPriceEstimate
        }}&nbsp;ETH
      </div>
      <br />
      <div
        :class="[
          isValidAddress && validAmount && validNetwork && address.length !== 0
            ? ''
            : 'disabled',
          'submit-button large-round-button-green-filled'
        ]"
        @click="confirmationModalOpen"
      >
        Send Secured Transaction
      </div>
      <interface-bottom-text
        :link-text="$t('interface.helpCenter')"
        :question="$t('interface.haveIssues')"
        link="https://heycoral.com/safesend/index.html"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import { CoralConfig } from './config';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import fetch from 'node-fetch';
import utils from 'web3-utils';
import { ErrorHandler, Misc } from '@/helpers';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    },
    highestGas: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      protectionLevel: 'low',
      advancedExpend: false,
      validNetwork: false,
      chainIDEnglish: CoralConfig.chainIDEnglish || 'mainnet',
      minimumAmount: 0.01,
      maxAmount: 5,
      amount: 0,
      safeSendPriceEstimate: 0,
      address: '',
      isValidAddress: false,
      hexAddress: '',
      gasAmount: 0
    };
  },
  computed: {
    ...mapGetters({
      account: 'account',
      gasPrice: 'gasPrice',
      web3: 'web3',
      network: 'network',
      ens: 'ens'
    }),
    validAmount() {
      return (
        new BigNumber(this.amount).gte(this.minimumAmount) &&
        new BigNumber(this.amount).lt(this.balance) &&
        new BigNumber(this.amount).lt(this.maxAmount)
      );
    },
    transactionFee() {
      return this.web3.utils.fromWei(
        new BigNumber(this.gasAmount)
          .times(CoralConfig.gasLimitSuggestion)
          .toFixed(0),
        'ether'
      );
    }
  },
  async mounted() {
    const coinbase = await this.web3.eth.getCoinbase();
    this.web3.eth
      .getBalance(coinbase)
      .then(res => {
        this.balance = this.web3.utils.fromWei(res, 'ether');
        this.$store.dispatch('setAccountBalance', res);
      })
      .catch(err => {
        ErrorHandler(err, true);
      });
    this.web3.eth.net
      .getId()
      .then(res => {
        this.networkID = res;
        this.validNetwork = this.networkID === CoralConfig.chainID;
      })
      .catch(err => {
        ErrorHandler(err, true);
      });
    this.gasAmount = this.gasPrice;
  },
  methods: {
    debouncedAmount: utils._.debounce(function(e) {
      this.amount = e.target.value;
      this.getSafeSendFee();
    }, 501),
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    },
    async createTx() {
      const coinbase = this.account.address;
      const nonce = await this.web3.eth.getTransactionCount(coinbase);
      const value = this.amount === '' ? 0 : unit.toWei(this.amount, 'ether');
      const CoralSafeSendContract = new this.web3.eth.Contract(
        CoralConfig.safeSendEscrowContractAbi,
        CoralConfig.safeSendEscrowContractAddress
      );
      const to = this.hexAddress;
      const protectionLevel = 20;
      const query = CoralSafeSendContract.methods.deposit(to, protectionLevel);
      const encodedABI = query.encodeABI();
      const gasLimit = CoralConfig.gasLimitSuggestion;
      const valuePlusFees = new BigNumber(value).plus(
        unit.toWei(this.safeSendPriceEstimate, 'ether')
      );
      const raw = {
        from: coinbase,
        value: Misc.sanitizeHex(valuePlusFees.toString(16)),
        to: CoralConfig.safeSendEscrowContractAddress,
        nonce: nonce,
        gas: gasLimit,
        data: encodedABI,
        gasPrice: Misc.sanitizeHex(
          new BigNumber(unit.toWei(this.gasAmount, 'gwei')).toString(16)
        ),
        chainId: 1
      };
      this.web3.eth.sendTransaction(raw).catch(err => {
        ErrorHandler(err, true);
      });
    },
    confirmationModalOpen() {
      this.createTx();
      window.scrollTo(0, 0);
    },
    changeGas(val) {
      this.gasAmount = val;
    },
    setBalanceToAmt() {
      this.amount = this.balance;
      this.getSafeSendFee();
    },
    async getSafeSendFee() {
      const rates = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      ).then(res => res.json());
      if (
        rates &&
        rates.data &&
        rates.data.ETH &&
        rates.data.ETH.quotes &&
        rates.data.ETH.quotes.USD &&
        rates.data.ETH.quotes.USD.price
      ) {
        const ETHUSDPrice = rates.data.ETH.quotes.USD.price;
        const amountOfEth = this.amount === '' ? 0 : this.amount;
        const baseFee = new BigNumber(0.3).div(new BigNumber(ETHUSDPrice));
        const mainFee = new BigNumber(amountOfEth).times(0.0015);
        const maxFee = new BigNumber(10).div(new BigNumber(ETHUSDPrice));
        if (baseFee.plus(mainFee).gt(maxFee)) {
          this.safeSendPriceEstimate = maxFee.toFixed(3);
        } else {
          this.safeSendPriceEstimate = baseFee.plus(mainFee).toFixed(3);
        }
      } else {
        this.safeSendPriceEstimate = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SecureTransaction.scss';
</style>
