import ABI from './ABI';
import configs from './config';
import Vue from 'vue';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';

export default class Sender {
  constructor({ address, web3, tokens, contractAddresses = [] }) {
    this.web3 = web3;
    this.contractAddresses = contractAddresses;
    this.tokens = tokens;
    this.address = address;
    this.isCryptoKitties = false;
    if (!this.web3) {
      throw Error(
        Vue.$i18n
          ? Vue.$i18n.t('nftManager.requires-web3')
          : 'NFT Module requires Web3'
      );
    }
    this.contract = new this.web3.eth.Contract(ABI);
    if (this.contractAddresses.includes(configs.cryptoKittiesContract)) {
      this.isCryptoKitties = true;
    }
  }

  updateTokens(tokens){
    this.tokens = tokens;
  }

  send(to, tokenId) {
    const details = this.getTokenDetails(tokenId);
    if (!details) {
      throw Error(
        Vue.$i18n
          ? Vue.$i18n.t('nftManager.token-id-not-found')
          : 'token id not found'
      );
    }
    let raw;
    if (this.isCryptoKitties) {
      raw = this.cryptoKittiesTransfer(to, tokenId, details);
    } else {
      raw = this.safeTransferFrom(to, tokenId, details);
    }

    raw.from = this.address;
    return this.web3.eth.sendTransaction(raw);
  }

  sendData(to, tokenId) {
    const details = this.getTokenDetails(tokenId);
    if (!details) {
      throw Error(
        Vue.$i18n
          ? Vue.$i18n.t('nftManager.token-id-not-found')
          : 'token id not found'
      );
    }
    let raw;
    if (this.isCryptoKitties) {
      raw = this.cryptoKittiesTransfer(to, tokenId, details);
    } else {
      raw = this.safeTransferFrom(to, tokenId, details);
    }

    raw.from = this.address;
    return raw;
  }

  txFee(gasLimit, gasPrice) {
    return BigNumber(gasPrice)
      .times(gasLimit || 0)
      .toFixed(0);
  }
  // tx fee in ether
  txFeeETH(gasLimit, gasPrice) {
    if (BigNumber(this.txFee(gasLimit, gasPrice)).gt(0)) {
      const txFee = this.txFee(gasLimit, gasPrice);
      return utils.fromWei(txFee, 'ether');
    }
    return '0';
  }
  // tx fee in usd
  txFeeUSD(gasLimit, ethPrice, gasPrice) {
    return BigNumber(
      BigNumber(this.txFeeETH(gasLimit, gasPrice)).times(BigNumber(ethPrice))
    )
      .toFixed(2)
      .toString();
  }

  safeTransferFrom(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods
        .safeTransferFrom(this.address, to, tokenId)
        .encodeABI()
    };
  }

  transferFrom(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods
        .transferFrom(this.address, to, tokenId)
        .encodeABI()
    };
  }

  cryptoKittiesTransfer(to, tokenId, details) {
    this.contract.options.address = details.contract;
    return {
      to: details.contract,
      data: this.contract.methods.transfer(to, tokenId).encodeABI()
    };
  }

  getTokenDetails(tokenId) {
    return this.tokens.find(item => (item.token_id == tokenId));
  }
}
