import { getHashFromFile, uploadFileToIpfs } from './helpers/helperIpfs.js';
import BigNumber from 'bignumber.js';
import ENSManagerInterface from './handlerENSManagerInterface.js';
import * as nameHashPckg from 'eth-ens-namehash';
import { DNSRegistrar } from '@ensdomains/ens-contracts/deployments/mainnet/DNSRegistrar.json';
import contentHash from 'content-hash';
import EventEmitter from 'events';
import vuexStore from '@/core/store';
import { mapGetters, mapState } from 'vuex';
import { toBN, toHex, fromWei, sha3 } from 'web3-utils';
import { estimateGasList } from '@/core/helpers/gasPriceHelper.js';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const bip39 = require('bip39');

export default class PermanentNameModule extends ENSManagerInterface {
  constructor(name, address, network, web3, ens, expiry) {
    super(name, address, network, web3, ens);
    this.$store = vuexStore;
    Object.assign(this, mapState('global', ['gasPriceType']));
    Object.assign(this, mapGetters('global', ['gasPriceByType']));
    this.expiryTime = expiry;
    this.secretPhrase = '';
    this.expiration = null;
    this.expired = false;
    this.redeemable = false;
    // Contracts
    this.dnsRegistrarContract = null;
    this.dnsClaim = null;
    this.dnsStatus = '';

    const int = setInterval(() => {
      if (this.registrarContract !== null) {
        this._initModule();
        clearInterval(int);
      }
    }, 5000);
  }

  register(duration, balance) {
    return this._registerWithDuration(duration, balance);
  }

  async setNameReverseRecord(domain) {
    try {
      return this.ensInstance.setReverseRecord(domain);
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  }

  getTransactions(toAddress) {
    const transferMethod = this.registrarContract?.methods.transferFrom(
      this.address,
      toAddress,
      this.labelHash
    );
    const baseTx = {
      to: this.registrarAddress,
      from: this.address,
      value: '0x0',
      gasPrice: toHex(this.gasPriceByType(this.gasPriceType)())
    };
    const tx1 = Object.assign({}, baseTx, {
      data: this.setController(toAddress, true).encodeABI()
    });
    const tx2 = Object.assign({}, baseTx, {
      data: transferMethod.encodeABI()
    });

    return [tx1, tx2];
  }

  async estimateGas(toAddress) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const txns = this.getTransactions(toAddress).map(item => {
        delete item['gasPrice'];
        return item;
      });
      try {
        const gas = await estimateGasList(this.network.type.name, txns);
        if (!gas) reject('Not enough gas');
        const gasTotal = gas.reduce((previousVal, currentVal) => {
          return toBN(previousVal).add(toBN(currentVal));
        }, toBN(0));
        const gasPrice = this.gasPriceByType(this.gasPriceType)();
        const txFee = toBN(gasPrice).mul(gasTotal);
        resolve(txFee);
      } catch (e) {
        reject(e);
      }
    });
  }

  transfer(toAddress) {
    return this.web3.mew.sendBatchTransactions(this.getTransactions(toAddress));
  }

  getActualDuration(duration) {
    const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
    return Math.ceil(SECONDS_YEAR * duration);
  }

  async getRentPrice(duration) {
    if (duration <= 0) {
      return;
    }
    if (this.registrarControllerContract) {
      const rentPrice = await this.registrarControllerContract.methods
        .rentPrice(this.parsedHostName, this.getActualDuration(duration))
        .call();
      return rentPrice;
    }
  }
  async totalRenewCost(duration) {
    try {
      const gasPrice = this.gasPriceByType()(this.gasPriceType());
      const rentPrice = await this.getRentPrice(duration);
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();
      const txObj = {
        from: this.address,
        value: withFivePercent
      };
      const extraFee = await this.registrarControllerContract.methods
        .renew(this.parsedHostName, this.getActualDuration(duration))
        .estimateGas(txObj);
      if (!extraFee) {
        return false;
      }
      return fromWei(toBN(gasPrice).add(toBN(extraFee)));
    } catch (e) {
      return false;
    }
  }

  async renew(duration, balance) {
    const rentPrice = await this.getRentPrice(duration);
    const hasBalance = new BigNumber(rentPrice).lte(balance);
    if (!hasBalance) {
      throw new Error('Not enough balance');
    }
    const withFivePercent = BigNumber(rentPrice)
      .times(1.05)
      .integerValue()
      .toFixed();
    return this.registrarControllerContract.methods
      .renew(this.parsedHostName, this.getActualDuration(duration))
      .send({ from: this.address, value: withFivePercent });
  }

  uploadFile(file) {
    return uploadFileToIpfs(file)
      .then(getHashFromFile)
      .then(hash => {
        return hash;
      });
  }

  setIPFSHash(hash) {
    const ipfsToHash = hash !== '' ? `0x${contentHash.fromIpfs(hash)}` : '0x';
    return this.resolverContract.methods
      .setContenthash(this.nameHash, ipfsToHash)
      .send({ from: this.address })
      .on('receipt', () => {
        this._getContentHash();
      });
  }

  // DNS claim name method
  claim() {
    return this.dnsClaim.submit({
      from: this.address
    });
  }

  generateKeyPhrase() {
    const words = [];
    const min = 0;
    const max = bip39.wordlists.EN.length;

    for (let i = 0; i < 3; i++) {
      words.push(
        bip39.wordlists.EN[Math.floor(Math.random() * (max - min + 1)) + min]
      );
    }
    this.secretPhrase = words.join(' ');
    return this.secretPhrase;
  }

  createCommitment() {
    const gasPrice = this.gasPriceByType()(this.gasPriceType());
    const txObj = { from: this.address, gasPrice: gasPrice };
    const promiEvent = new EventEmitter();
    this.registrarControllerContract.methods
      .makeCommitmentWithConfig(
        this.parsedHostName,
        this.address,
        sha3(this.secretPhrase),
        this.publicResolverAddress,
        this.address
      )
      .call()
      .then(commitment => {
        return this.registrarControllerContract.methods
          .commit(commitment)
          .send(txObj)
          .on('transactionHash', hash =>
            promiEvent.emit('transactionHash', hash)
          )
          .once('receipt', receipt => promiEvent.emit('receipt', receipt))
          .on('error', err => promiEvent.emit('error', err))
          .then(receipt => promiEvent.emit('receipt', receipt))
          .catch(err => promiEvent.emit('error', err));
      });
    return promiEvent;
  }

  async getCommitmentFees() {
    try {
      const gasPrice = this.gasPriceByType()(this.gasPriceType());
      const commitTxObj = { from: this.address };
      const createCommitment = await this.registrarControllerContract.methods
        .makeCommitmentWithConfig(
          this.parsedHostName,
          this.address,
          sha3(this.secretPhrase),
          this.publicResolverAddress,
          this.address
        )
        .call();
      const gasLimit = await this.registrarControllerContract.methods
        .commit(createCommitment)
        .estimateGas(commitTxObj);
      return fromWei(toBN(gasPrice).mul(toBN(gasLimit)));
    } catch (e) {
      return e;
    }
  }

  async getMinimumAge() {
    const minimumAge = await this.registrarControllerContract.methods
      .minCommitmentAge()
      .call();
    return `${parseInt(minimumAge) + 30}`;
  }

  async _initModule() {
    // initial value for the variables
    const values = {
      secretPhrase: 'secretPhrase',
      expiration: 'expiration',
      expired: 'expired',
      redeemable: 'redeemable',
      // Contracts
      dnsRegistrarContract: 'dnsRegistrarContract',
      dnsClaim: 'dnsClaim',
      dnsStatus: 'dnsStatus'
    };
    const obj = {};
    Object.keys(values).forEach(propName => {
      Object.defineProperty(obj, propName, {
        enumerable: true,
        get: () => {
          return this[values[propName]];
        },
        set: value => {
          this[values[propName]] = value;
        }
      });
    });
    this._getExpiry();
  }

  async _getExpiry() {
    if (!this.isAvailable) {
      this.expired = this.expiryTime * 1000 < new Date().getTime();
      if (!this.expired) {
        const date = new Date(this.expiryTime * 1000);
        this.expiration =
          date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
      }
    }
    this._getDnsContract();
  }

  async _getDnsContract() {
    if (this.tld && this.tld !== this.network.type.ens.registrarTLD) {
      this.dnsRegistrarContract = new this.web3.eth.Contract(
        DNSRegistrar.abi,
        this.registrarAddress
      );
      this.dnsClaim = await this.dnsRegistrar.methods
        .claim(this.parsedDomainName)
        .call();
      this._getDnsInfo();
    }
    return;
  }
  async _getDnsInfo() {
    const _owner = await this.ens.owner(this.parsedDomainName);
    const isInNewRegistry = await this.registryContract.methods
      .recordExists(nameHashPckg.hash(this.parsedDomainName))
      .call();
    if (this.dnsClaim.result.found && !isInNewRegistry) {
      this.dnsStatus = 'claimable';
    } else if (
      this.dnsClaim.result.found &&
      this.dnsClaim.getOwner().toLowerCase() === _owner.toLowerCase()
    ) {
      this.dnsStatus = 'owned';
    } else if (this.dnsClaim.result.found) {
      this.dnsStatus = 'claimable';
    } else if (this.dnsClaim.result.nsec) {
      this.dnsStatus = 'unclaimable';
    } else {
      this.dnsStatus = 'dnsecerror';
    }
  }

  _registerWithDuration(duration, balance) {
    const utils = this.web3.utils;
    const promiEvent = new EventEmitter();
    this.getRentPrice(duration).then(rentPrice => {
      const hasBalance = new BigNumber(balance).gte(rentPrice);
      if (!hasBalance) {
        promiEvent.emit('error', new Error('Not enough balance'));
        return;
      }
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();
      const txObj = {
        from: this.address,
        value: withFivePercent
      };
      const registerWithConfig =
        this.registrarControllerContract.methods.registerWithConfig(
          this.parsedHostName,
          this.address,
          this.getActualDuration(duration),
          utils.sha3(this.secretPhrase),
          this.publicResolverAddress,
          this.address
        );

      registerWithConfig
        .estimateGas(txObj)
        .then(res => {
          txObj['gas'] = res;
          registerWithConfig
            .send(txObj)
            .on('transactionHash', hash =>
              promiEvent.emit('transactionHash', hash)
            )
            .on('error', err => promiEvent.emit('error', err))
            .on('receipt', receipt => promiEvent.emit('receipt', receipt));
        })
        .catch(err => promiEvent.emit('error', err));
    });
    return promiEvent;
  }

  async getRegFees(duration, balance) {
    try {
      const gasPrice = this.gasPriceByType()(this.gasPriceType());
      const rentPrice = await this.getRentPrice(duration);
      const hasBalance = new BigNumber(balance).gte(rentPrice);
      if (hasBalance) {
        const rentPriceWithFivePercent = new BigNumber(rentPrice)
          .times(1.05)
          .integerValue()
          .toFixed();
        const txObj = {
          from: this.address,
          value: rentPriceWithFivePercent
        };
        const gasAmt = await this.registrarControllerContract.methods
          .registerWithConfig(
            this.parsedHostName,
            this.address,
            this.getActualDuration(duration),
            sha3(this.secretPhrase),
            this.publicResolverAddress,
            this.address
          )
          .estimateGas(txObj);
        if (!gasAmt) {
          return false;
        }
        return fromWei(
          toBN(gasAmt).mul(toBN(gasPrice)).add(toBN(rentPriceWithFivePercent))
        );
      }
    } catch (e) {
      return false;
    }
  }
}
