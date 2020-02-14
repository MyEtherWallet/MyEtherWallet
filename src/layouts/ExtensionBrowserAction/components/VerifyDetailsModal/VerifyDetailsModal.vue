<template>
  <div>
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
            <div
              v-if="Object.keys(wallet).length > 0"
              class="blockie-container"
            >
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
                    {{ totalValue }}
                  </p>
                </div>
              </div>
              <div class="wallet-value-container">
                <p class="wallet-title">
                  {{ network.type.currencyName }} Balance
                </p>
                <!-- <p class="dollar-amt">
                  {{
                    network.type.name === 'ETH'
                      ? convertedBalance
                      : fixedEthBalance
                  }}
                </p>
                <p v-if="network.type.name === 'ETH'" class="value">
                  {{ fixedEthBalance }}
                </p> -->
              </div>
              <div class="wallet-value-container">
                <p class="wallet-title">Value of Token</p>
                <!-- <p class="dollar-amt">{{ walletTokensWithBalance.total }}</p>
                <p class="value">
                  {{ walletTokensWithBalance.tokensWDollarAmtLength }} tokens
                </p> -->
              </div>
            </div>
          </div>
        </div>
        <div class="button-container"></div>
      </div>
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import {
  KEYSTORE as keyStoreType,
  MNEMONIC as mnemonicType,
  PRIV_KEY as privateKeyType
} from '@/wallets/bip44/walletTypes';
import { Toast } from '@/helpers';

const ACTUAL_TITLES = {};
ACTUAL_TITLES[keyStoreType] = 'Keystore File (UTC/JSON)';
ACTUAL_TITLES[mnemonicType] = 'Mnemonic Phrase';
ACTUAL_TITLES[privateKeyType] = 'Private Key';

export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper,
    blockie: Blockie
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
    }
  },
  data() {
    return {
      ethBalance: '0',
      tokenTotalValue: '0'
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
    actualTitle() {
      return ACTUAL_TITLES[this.title];
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
            this.balance = this.web3.utils.fromWei(res, 'ether');
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      }
    }
  },
  methods: {
    getTokenDollarValue() {}
  }
};
</script>

<style scoped lang="scss">
@import 'VerifyDetailsModal.scss';
</style>
