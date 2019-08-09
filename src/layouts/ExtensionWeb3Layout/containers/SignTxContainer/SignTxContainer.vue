<template>
  <div class="sign-transaction-container">
    <div class="sign-transaction-header">
      <p>Confirmation</p>
    </div>
    <div class="sign-transaction-addresses">
      <amount-info-component
        :direction="'from'"
        :address="linkQuery.from"
        :amount="hexToNumString(linkQuery.value, 'ether')"
      />
      <img src="@/assets/images/icons/arrow-down-blue.svg" />
      <amount-info-component
        :direction="'to'"
        :address="linkQuery.to"
        :amount="
          linkQuery.tokenSymbol !== ''
            ? hexToNumString(linkQuery.tokenTransferVal)
            : hexToNumString(linkQuery.value, 'ether')
        "
        :currency="linkQuery.tokenSymbol !== '' ? linkQuery.tokenSymbol : 'ETH'"
        :contract-address="linkQuery.tokenTransferTo"
      />
    </div>
    <div :class="[showDetails ? 'add-margin' : '', 'details-container']">
      <div class="details-header-container">
        <p>Details</p>
        <div class="sliding-switch-white">
          <label class="switch">
            <input
              :checked="showDetails"
              type="checkbox"
              @click="toggleDetails"
            />
            <span class="slider round" />
          </label>
        </div>
      </div>
      <div
        :class="[
          showDetails ? 'shown' : 'hide-box',
          'details-content-container'
        ]"
      >
        <div class="detail-item">
          <span class="title">Network </span>
          <span class="content">ETH by {{ network.service }} </span>
        </div>
        <div class="detail-item">
          <span class="title"> Gas Limit </span>
          <span class="content">
            {{ hexToNumString(linkQuery.gasLimit) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="title"> Gas Price </span>
          <span class="content">
            {{ hexToNumString(linkQuery.gasPrice, 'gwei') }}
          </span>
        </div>
        <div class="detail-item">
          <span class="title"> Nonce </span>
          <span class="content"> {{ hexToNumString(linkQuery.nonce) }} </span>
        </div>
        <div class="detail-item">
          <span class="title"> Data </span>
          <span class="content"> {{ linkQuery.data }} </span>
        </div>
      </div>
    </div>
    <accept-cancel-buttons
      :func-one="openPasswordModal"
      :func-two="rejectAction"
      text-one="Continue"
      text-two="Reject"
    />
    <password-modal-component
      ref="passwordModal"
      :func="unlockWallet"
      :action-name="'Sign and Send'"
      :loading="loading"
      :error="error"
      @passwordChange="updatePassword"
    />
  </div>
</template>

<script>
import AmountInfoComponent from '../../components/AmountInfoComponent';
import PasswordModalComponent from '../../components/PasswordModalComponent';
import AcceptCancelButtons from '../../components/AcceptCancelButtons';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Transaction } from 'ethereumjs-tx';
import { Misc } from '@/helpers';
import {
  REJECT_MEW_TX_SIGN,
  MEW_TX_HASH
} from '@/builds/mewcx/cxHelpers/cxEvents';
export default {
  components: {
    'amount-info-component': AmountInfoComponent,
    'password-modal-component': PasswordModalComponent,
    'accept-cancel-buttons': AcceptCancelButtons
  },
  data() {
    return {
      showDetails: true,
      signingKeystore: '',
      wallet: {},
      password: '',
      loading: false,
      error: {}
    };
  },
  computed: {
    ...mapState(['linkQuery', 'network', 'web3']),
    txParams() {
      const {
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        from
      } = this.linkQuery;
      return {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: to,
        value: value,
        data: data,
        from: from
      };
    }
  },
  mounted() {
    const _self = this;
    window.chrome.storage.sync.get(_self.linkQuery.from, function(res) {
      _self.signingKeystore = JSON.parse(res[_self.linkQuery.from]).priv;
    });
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    openPasswordModal() {
      this.$refs.passwordModal.$refs.passwordModal.show();
    },
    updatePassword(e) {
      this.error = {
        msg: '',
        errored: false
      };
      this.password = e;
    },
    hexToNumString(hex, convertTo) {
      if (convertTo) {
        return utils.fromWei(new BigNumber(hex).toString(), convertTo);
      }
      return new BigNumber(hex).toString();
    },
    unlockWallet() {
      this.loading = true;
      const worker = new walletWorker();
      const _self = this;
      worker.postMessage({
        type: 'unlockWallet',
        data: [JSON.parse(this.signingKeystore), this.password]
      });
      worker.onmessage = function(e) {
        _self.loading = false;
        _self.signAndSend(
          new WalletInterface(Buffer.from(e.data._privKey), false, keyStoreType)
        );
      };

      worker.onerror = function(e) {
        e.preventDefault();
        _self.loading = false;
        _self.error = {
          msg: 'Unlock failed: Wrong password!',
          errored: true
        };
      };
    },
    rejectAction() {
      const _self = this;
      window.chrome.tabs.query(
        { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
        function(tab) {
          const obj = {
            event: REJECT_MEW_TX_SIGN
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        }
      );
    },
    async signAndSend(wallet) {
      const _self = this;
      const newTx = new Transaction(_self.txParams);
      const signedTx = await wallet.signTransaction(newTx);
      this.web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(
        e,
        hash
      ) {
        if (e) {
          window.chrome.tabs.query(
            { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
            function(tab) {
              const obj = {
                event: REJECT_MEW_TX_SIGN
              };
              window.chrome.tabs.sendMessage(tab[0].id, obj);
              window.close();
            }
          );
        }
        window.chrome.tabs.query(
          { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
          function(tab) {
            const obj = {
              event: MEW_TX_HASH,
              hash: hash
            };
            window.chrome.tabs.sendMessage(tab[0].id, obj);
            window.close();
          }
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignTxContainer.scss';
</style>
