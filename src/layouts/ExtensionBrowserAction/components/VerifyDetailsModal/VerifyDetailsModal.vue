<template>
  <mewcx-modal-wrapper ref="viewWalletModal" direction="up">
    <template v-slot:modalContentTitle>
      {{ $t('mewcx.view-wallet-detail') }}
    </template>
    <template v-slot:modalCloserButton>
      <div></div>
    </template>
    <div class="verify-details-container">
      <div class="wallet-info-and-code">
        <div class="blockie-and-address">
          <div v-if="Object.keys(wallet).length > 0" class="blockie-container">
            <blockie
              width="45px"
              height="45px"
              :address="wallet.getAddressString()"
            />
          </div>
          <div class="name-and-address">
            <h3>{{ nickname }}</h3>
            <p>{{ wallet.getAddressString() }}</p>
          </div>
        </div>
        <div class="qr-code-container">
          <qrcode :value="address" :options="{ size: 100 }" />
          <p>
            Wallet QR Code
          </p>
        </div>
      </div>
      <div class="wallet-info-body">
        <div class="main-wallet-content">
          <div class="main-wallet-content-container">
            <div class="wallet-value-with-img">
              <div class="wallet-img-container">
                <img
                  alt
                  class="icon"
                  src="~@/assets/images/icons/wallet-with-background.svg"
                />
              </div>
              <div class="wallet-value-container">
                <p class="wallet-title">Total Wallet Value</p>
                <p v-if="network.type.name === 'ETH'" class="dollar-amt">
                  {{ walletTokensWithBalance.totalWalletBalance }}
                </p>
              </div>
            </div>
            <div class="wallet-value-container">
              <p class="wallet-title">
                {{ network.type.currencyName }} Balance
              </p>
              <p class="dollar-amt">
                {{ ethBalance }}
              </p>
            </div>
            <div class="wallet-value-container">
              <p class="wallet-title">Value of Token</p>
              <p class="dollar-amt">{{ walletTokensWithBalance.total }}</p>
              <p class="value">
                {{ walletTokensWithBalance.tokensWDollarAmtLength }} tokens
              </p>
            </div>
          </div>
        </div>
        <div v-for="item in buttons" :key="item.title" class="button-container">
          <div class="img-and-title-container">
            <img :src="item.icon" />
            <p>{{ $t(item.title) }}</p>
          </div>
          <p class="func-container" @click="item.func">
            {{ $t(item.funcText) }}
          </p>
        </div>
      </div>
    </div>
    <div class="exit-button-container">
      <div class="exit-button" @click="lockAndExit">
        {{ $t('mewcx.lock-wallet') }}
      </div>
    </div>
    <view-private-key-modal ref="privKeyModal" />
    <print-modal
      ref="printModal"
      :priv-key="!wallet"
      :address="wallet.getChecksumAddressString()"
    />
  </mewcx-modal-wrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import { Toast } from '@/helpers';

import privKey from '@/assets/images/icons/private-key.svg';
import keystore from '@/assets/images/icons/download-keystore.svg';
import printWallet from '@/assets/images/icons/paper-wallet.svg';
import txHistory from '@/assets/images/icons/tx-history.svg';
import ViewPrivateKey from '../ViewPrivateKey';
import PrintModal from '@/layouts/InterfaceLayout/components/PrintModal';
import createBlob from '@/helpers/createBlob.js';

export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper,
    blockie: Blockie,
    'view-private-key-modal': ViewPrivateKey,
    'print-modal': PrintModal
  },
  props: {
    usd: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    nickname: {
      type: String,
      default: ''
    },
    walletTokensWithBalance: {
      type: Object,
      default: () => {}
    },
    file: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ethBalance: '0',
      tokenTotalValue: '0',
      buttons: [
        {
          title: 'mewcx.keystore-file',
          icon: keystore,
          funcText: 'mewcx.download',
          func: () => {
            this.downloadKeystore();
          }
        },
        {
          title: 'mewcx.private-key',
          icon: privKey,
          funcText: 'mewcx.view',
          func: () => {
            this.viewPrivateKey();
          }
        },
        {
          title: 'mewcx.transaction-history',
          icon: txHistory,
          funcText: 'mewcx.view-tx-history',
          func: () => {
            this.openTxHistory();
          }
        },
        {
          title: 'mewcx.paper-wallet',
          icon: printWallet,
          funcText: 'mewcx.print',
          func: () => {
            this.viewPrint();
          }
        }
      ],
      walletJson: '',
      filename: ''
    };
  },
  computed: {
    ...mapState('main', ['web3', 'wallet', 'network']),
    address() {
      const hasWallet = Object.keys(this.wallet).length > 0;
      return hasWallet
        ? this.wallet.hasOwnProperty('isHardware')
          ? '0x'
          : this.wallet.getAddressString()
        : '0x';
    },
    totalValue() {
      const totalBalance = new BigNumber(this.usd).times(this.ethBalance);
      const combinedValue = new BigNumber(this.tokenTotalValue)
        .plus(totalBalance)
        .toFixed(2);

      return `$ ${combinedValue}`;
    },
    convertedEthValue() {
      return `$ ${new BigNumber(this.ethBalance).times(this.usd).toFixed(2)}`;
    }
  },
  watch: {
    wallet(newVal) {
      if (Object.keys(newVal).length > 0 && newVal.identifier === 'keystore') {
        this.web3.eth
          .getBalance(newVal.getAddressString())
          .then(res => {
            this.ethBalance = this.web3.utils.fromWei(res, 'ether');
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      }
    }
  },
  mounted() {
    this.walletJson = createBlob(this.file, 'mime');
    this.filename = this.nickname;
  },
  methods: {
    ...mapActions('main', ['clearWallet']),
    lockAndExit() {
      this.clearWallet().then(() => {
        this.$refs.viewWalletModal.$refs.modalWrapper.hide();
      });
    },
    viewPrint() {
      this.$refs.printModal.$refs.print.show();
    },
    downloadKeystore() {
      window.chrome.downloads.download({
        filename: this.filename,
        url: this.walletJson
      });
    },
    viewPrivateKey() {
      this.$refs.privKeyModal.$refs.viewPriv.show();
    },
    openTxHistory() {
      // eslint-disable-next-line
      window.open(
        `${this.network.type.blockExplorerAddr.replace('[[address]]', '') +
          this.wallet.getChecksumAddressString()}`,
        '_blank'
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import 'VerifyDetailsModal.scss';
</style>
