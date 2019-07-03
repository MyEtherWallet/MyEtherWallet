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
    <button
      :class="[showDetails ? '' : 'details-closed', 'continue-button']"
      @click="openPasswordModal"
    >
      Continue
    </button>
    <password-modal-component
      ref="passwordModal"
      :func="unlockWallet"
      :action-name="'Sign and Send'"
      @passwordChange="updatePassword"
    />
  </div>
</template>

<script>
import AmountInfoComponent from '../../components/AmountInfoComponent';
import PasswordModalComponent from '../../components/PasswordModalComponent';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Transaction } from 'ethereumjs-tx';
import { Misc } from '@/helpers';
export default {
  components: {
    'amount-info-component': AmountInfoComponent,
    'password-modal-component': PasswordModalComponent
  },
  data() {
    return {
      showDetails: true,
      signingKeystore: '',
      wallet: {},
      password: ''
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
      this.password = e;
    },
    hexToNumString(hex, convertTo) {
      if (convertTo) {
        return utils.fromWei(new BigNumber(hex).toString(), convertTo);
      }
      return new BigNumber(hex).toString();
    },
    unlockWallet() {
      const worker = new walletWorker();
      const self = this;
      worker.postMessage({
        type: 'unlockWallet',
        data: [JSON.parse(this.signingKeystore), this.password]
      });
      worker.onmessage = function(e) {
        self.signAndSend(
          new WalletInterface(Buffer.from(e.data._privKey), false, keyStoreType)
        );
      };
    },
    async signAndSend(wallet) {
      const _self = this;
      const newTx = new Transaction(_self.txParams);
      const signedTx = await wallet.signTransaction(newTx);
      this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      window.close();
      // window.chrome.tabs.query(
      //   { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
      //   function(tab) {
      //     console.log('got here 1?');
      //     const obj = {
      //       msg: 'mewTxHash',
      //       hash: hash
      //     };
      //     window.chrome.tabs.sendMessage(tab[0].id, obj);
      //     window.close();
      //   }
      // );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignTxContainer.scss';
</style>
