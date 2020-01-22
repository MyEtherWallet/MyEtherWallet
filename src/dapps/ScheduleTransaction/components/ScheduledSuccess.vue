<template>
  <div class="scheduled-success-container">
    <h3 class="page-title">
      {{
        isTokenTransfer && approved
          ? $t('scheduleTx.approved')
          : $t('scheduleTx.scheduled')
      }}
    </h3>

    <div class="page-container">
      <div class="break-word">
        <i18n :path="getPathMined" tag="span">
          <scheduled-transaction-explorer-link slot="hash" :tx-hash="txHash" />
        </i18n>
      </div>

      <b-alert
        :show="!approved && isTokenTransfer"
        variant="warning"
        class="m-5 horizontal-center"
      >
        <div v-if="!mined">
          <div>{{ $t('scheduleTx.wait-for-mined') }}</div>
          <div class="fa-3x">
            <i class="fa fa-spinner fa-spin fa-lg" />
          </div>
          <div>
            <strong>{{ $t('scheduleTx.note.string') }}</strong>
            <i18n path="scheduleTx.note.approve-tx" tag="span">
              <scheduled-transaction-explorer-link
                slot="this"
                :tx-hash="txHash"
                :link-text="$t('scheduleTx.note.this')"
              />
            </i18n>
          </div>
        </div>
        <div v-if="mined">
          <div>
            <i18n path="scheduleTx.approve.desc" tag="span">
              <strong slot="approve">{{
                $t('scheduleTx.approve.string')
              }}</strong>
            </i18n>
          </div>
          <div
            class="submit-button large-round-button-green-filled mt-3"
            @click="approveToken()"
          >
            {{ $t('scheduleTx.approve.token-transfer') }}
          </div>
        </div>
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import { Util } from '@ethereum-alarm-clock/lib';

import { Toast } from '@/helpers';
import { ERC20 } from '@/partners';
import ScheduledTransactionExplorerLink from '../components/ScheduledTransactionExplorerLink';
import { EAC_SCHEDULING_CONFIG } from '../ScheduleHelpers';

export default {
  name: 'Scheduled',
  components: {
    'scheduled-transaction-explorer-link': ScheduledTransactionExplorerLink
  },
  props: {
    txHash: {
      type: String,
      default: ''
    },
    isTokenTransfer: {
      type: Boolean,
      default: false
    },
    toAddress: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: ''
    },
    selectedCurrency: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      approved: this.isTokenTransfer ? false : true,
      receipt: null,
      scheduledTxAddress: null,
      mined: false
    };
  },
  computed: {
    ...mapState('main', [
      'notifications',
      'web3',
      'account',
      'gasPrice',
      'network'
    ]),
    getPathMined() {
      return !this.mined
        ? 'scheduleTx.tx-scheduled-hash[1]'
        : 'scheduleTx.tx-scheduled-hash[0]';
    }
  },
  watch: {
    async notifications() {
      const notifications = this.notifications[this.account.address];
      const latestNotification = notifications[0];

      if (latestNotification.hash) {
        if (
          latestNotification.status === 'complete' &&
          this.txHash === latestNotification.hash
        ) {
          const receipt = await this.web3.eth.getTransactionReceipt(
            this.txHash
          );
          const util = new Util(this.web3);
          this.receipt = receipt;
          this.scheduledTxAddress = util.getTransactionRequestAddressFromReceipt(
            receipt
          );
          this.mined = true;
        } else if (latestNotification.status === 'pending') {
          const transaction = await this.web3.eth.getTransaction(
            latestNotification.hash
          );

          if (transaction === null) {
            Toast.responseHandler(
              new Error('Non-existing transaction detected'),
              Toast.ERROR
            );
            return;
          }

          if (
            transaction.input.includes(
              EAC_SCHEDULING_CONFIG.APPROVE_TOKEN_TRANSFER_METHOD_ID
            )
          ) {
            if (
              transaction.input.includes(this.scheduledTxAddress.substring(2))
            ) {
              this.approved = true;
            }
          }
        }
      }
    }
  },
  methods: {
    async approveToken() {
      if (!this.selectedCurrency) {
        Toast.responseHandler(
          new Error(`${this.txHash} is not a token transfer.`),
          Toast.ERROR
        );
        return;
      }

      const tokenContract = await new this.web3.eth.Contract(
        ERC20,
        this.selectedCurrency.address
      );

      const coinbase = await this.web3.eth.getCoinbase();
      const tokenAmount = new BigNumber(
        this.amount * Math.pow(10, this.selectedCurrency.decimals)
      );

      const approveTokensData = tokenContract.methods
        .approve(this.scheduledTxAddress, tokenAmount.toString())
        .encodeABI();
      const nonce = await this.web3.eth.getTransactionCount(coinbase, 'latest');

      const numIfHex = input =>
        this.web3.utils.isHexStrict(input)
          ? this.web3.utils.hexToNumber(input)
          : input;

      const scheduledTokensApproveTransaction = {
        from: coinbase,
        to: this.selectedCurrency.address,
        value: '',
        data: approveTokensData,
        nonce: numIfHex(nonce),
        gasPrice: this.web3.utils.toWei(
          numIfHex(this.gasPrice).toString(),
          'gwei'
        )
      };

      const estimatedGasLimit = await this.web3.eth.estimateGas(
        scheduledTokensApproveTransaction
      );
      scheduledTokensApproveTransaction.gasLimit = estimatedGasLimit + 1000000;
      const approveTx = new Transaction(scheduledTokensApproveTransaction);

      const json = approveTx.toJSON(true);
      json.from = coinbase;
      this.web3.eth.sendTransaction(json).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    }
  }
};
</script>

<style lang="scss">
@import 'ScheduledSuccess.scss';
</style>
