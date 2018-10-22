<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation">
      <div class="time-remaining">
        <h1>09:25</h1>
        <p>Time Remaining</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <img :src="fromAddress.image">
          </div>
          <p class="value">{{ fromAddress.value }} <span>{{ fromAddress.name }}</span></p>
          <p class="block-title">From Address</p>
          <p class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow">
          <img :src="arrowImage">
        </div>
        <div class="to-address">
          <div class="icon">
            <img :src="toAddress.image">
          </div>
          <p class="value">{{ toAddress.value }} <span>{{ toAddress.name }}</span></p>
          <p class="block-title">To Address</p>
          <p class="address">{{ toAddress.address }}</p>
        </div>
      </div>

      <detail-information :details="detailInfo"/>

      <div
        class="confirm-send-button"
        @click="sendTransaction">
        <button-with-qrcode
          :qrcode="qrcode"
          buttonname="Confirm and Send"/>
      </div>

      <help-center-button/>

    </b-modal>
  </div>
</template>

<script>
/* eslint-disable*/
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

export default {
  components: {
    'detail-information': DetailInformation,
    'button-with-qrcode': ButtonWithQrCode,
    'help-center-button': HelpCenterButton
  },
  props: {
    swapDetails: {
      type: Object,
      default: function() {
        return {};
      }
    },
    currentAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isToken: false,
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      qrcode: '',
      arrowImage: Arrow,
      fromAddress: {
        image: iconEth,
        value: '1.0000000000',
        name: 'ETH',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      },
      toAddress: {
        image: iconBtc,
        value: '0.0034523',
        name: 'BTC',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      },
      detailInfo: {
        network: {
          name: 'Network',
          value: 'ETH by mytherapi.com'
        },
        gas: {
          name: 'Gas Limit',
          value: '21000'
        },
        gasPrice: {
          name: 'Gas Price',
          value: '210000 Gwei (0.00321 ETH=$1.234)'
        },
        transactionFee: {
          name: 'Max Transaction Fee',
          value: '441000 Gwei (0.000441 ETH)'
        },
        nonce: {
          name: 'Nonce',
          value: '0'
        },
        data: {
          name: 'Data',
          value: 'None'
        }
      }
    };
  },
  watch: {
    swapDetails(newValue) {
      this.fromAddress = {
        image: this.currencyIcons[newValue.fromCurrency],
        value: newValue.fromValue,
        name: newValue.fromCurrency,
        address: newValue.fromAddress ? newValue.fromAddress : ''
      };
      this.toAddress = {
        image: this.currencyIcons[newValue.toCurrency],
        value: newValue.toValue,
        name: newValue.toCurrency,
        address: newValue.toAddress
      };
    }
  },
  methods: {
    prepare() {
      if (value.dataForInitialization) {
      }
    },
    sendTransaction() {
      this.swapStarted(this.swapDetails);
      this.$refs.swapconfirmation.hide();
      // this.$emit('swapStarted');
    },
    createTokenTransferData(fromAddress, amount, tokenDetails) {
      if (this.swapDetails.fromCurrency !== 'ETH') {
        const jsonInterface = [
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_amount', type: 'uint256' }
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ];
        const contract = new this.$store.state.web3.eth.Contract(
          jsonInterface,
          tokenDetails.address
        );
        return contract.methods
          .transfer(
            fromAddress,
            new BigNumber(amount)
              .times(new BigNumber(10).pow(tokenDetails.decimals))
              .toFixed()
          )
          .encodeABI();
      } else {
        return '0x';
      }
    },
    swapStarted(swapDetails) {
      if (swapDetails.dataForInitialization) {
        switch (swapDetails.provider) {
          case 'changelly':
            this.useChangelly(swapDetails);
            break;
          case 'bity':
            this.useBity(swapDetails);
            break;
          case 'kybernetwork':
            this.useKyber(swapDetails);
            break;
        }
      }
    },
    async useBity(swapDetails) {
      let raw = {};

      console.log(swapDetails); // todo remove dev item
      if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
        const tokenInfo = this.$store.state.network.type.tokens.find(item => {
          return item.symbol === swapDetails.fromCurrency;
        });
        const txData = this.createTokenTransferData(
          this.currentAddress,
          swapDetails.fromValue,
          tokenInfo
        );
        raw = await this.createSwapTransaction(swapDetails, txData);
      } else if (swapDetails.maybeToken && swapDetails.fromCurrency === 'ETH'){
        raw = await this.createSwapTransaction(swapDetails);
        console.log('changelly Raw Tx: ', raw); // todo remove dev item
      }
      // this.$store.dispatch('addSwapTransaction', [
      //   this.currentAddress,
      //   swapDetails
      // ]);
      if(Object.keys(raw).length > 0){
        // this.$store.state.web3.eth.sendTransaction(raw);
      }
    },
    async useChangelly(swapDetails) {
      let raw = {};
      console.log(swapDetails); // todo remove dev item
      if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
        const tokenInfo = this.$store.state.network.type.tokens.find(item => {
          return item.symbol === swapDetails.fromCurrency;
        });
        const txData = this.createTokenTransferData(
          this.currentAddress,
          swapDetails.fromValue,
          tokenInfo
        );
        raw = await this.createSwapTransaction(swapDetails, txData);
      } else if (swapDetails.maybeToken && swapDetails.fromCurrency === 'ETH'){
        raw = await this.createSwapTransaction(swapDetails);
        console.log('changelly Raw Tx: ', raw); // todo remove dev item
      }
      if(Object.keys(raw).length > 0){
        // this.$store.state.web3.eth.sendTransaction(raw);
      }
    },
    async useKyber(swapDetails) {
      const txDatas = swapDetails.dataForInitialization;
      const bulkTx = [];
      let txCount = 0;
      try {
        let nonce = await this.$store.state.web3.eth.getTransactionCount(
          this.$store.state.wallet.getAddressString()
        );

        for (let [key, value] of txDatas) {
          if (key === 'reset' || key === 'approve') {
            const raw = {
              from: this.$store.state.wallet.getAddressString(),
              gas: 2100,
              gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
              value: 0,
              to: txData.get('tokenAddress'),
              data: value,
              chainId: this.$store.state.network.type.chainID || 1
            };

            raw.gas = await this.estimateGas(raw);
            raw.nonce = nonce + txCount;

            if (window.web3 && this.$store.state.wallet.identifier === 'Web3') {
              raw['web3WalletOnly'] = true;
            }
            bulkTx.push(raw);
            txCount++;
          } else if (key === 'swap') {
            const swapTx = await this.createSwapTransaction(
              swapDetails,
              value,
              nonce + txCount
            );
            bulkTx.push(swapTx);
            console.log('kyber Raw Txs: ', bulkTx); // todo remove dev item
            this.$store.state.web3.eth.sendBatchTransactions(bulkTx); // because maps iterate in insertion order, and the swap tx always gets added last
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    async createSwapTransaction(swapDetails, txData, increNonce) {
      let nonce;
      try {
        if (!increNonce) {
          nonce = await this.$store.state.web3.eth.getTransactionCount(
            this.$store.state.wallet.getAddressString()
          );
        } else {
          nonce = increNonce;
        }
        const isEth = swapDetails.fromCurrency === 'ETH';

        const raw = {
          from: this.$store.state.wallet.getAddressString(),
          gasPrice: Number(unit.toWei(this.$store.state.gasPrice, 'gwei')),
          value: isEth ? unit.toWei(swapDetails.fromValue, 'ether') : 0,
          to: swapDetails.providerAddress,
          data: txData ? txData : '0x',
          chainId: this.$store.state.network.type.chainID || 1
        };

        raw.gas = await this.estimateGas(raw);
        raw.nonce = nonce;

        if (window.web3 && this.$store.state.wallet.identifier === 'Web3') {
          raw['web3WalletOnly'] = true;
        }

        return raw;
      } catch (e) {
        console.error(e);
      }
    },
    createSwapTransactions(swapDetails, txDataArray) {},
    async estimateGas(raw) {
      try {
        const newRaw = {...raw};
        // delete newRaw['gas'];
        // delete newRaw['nonce'];
        console.log(newRaw); // todo remove dev item
        console.log(newRaw.gas); // todo remove dev item

        return await this.$store.state.web3.eth.estimateGas(newRaw);
      } catch (e) {
        console.error(e)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
