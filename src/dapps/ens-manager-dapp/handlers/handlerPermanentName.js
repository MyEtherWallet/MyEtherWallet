import { getHashFromFile, uploadFileToIpfs } from './helpers/helperIpfs.js';
import BigNumber from 'bignumber.js';
import ENSManagerInterface from './handlerENSManagerInterface.js';
import * as nameHashPckg from 'eth-ens-namehash';
import { DNSRegistrar } from '@ensdomains/ens-contracts';
import contentHash from 'content-hash';
import EventEmitter from 'events';
const bip39 = require('bip39');

export default class PermanentNameModule extends ENSManagerInterface {
  constructor(name, address, network, web3, ens, expiry) {
    super(name, address, network, web3, ens);
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

  transfer(toAddress) {
    console.log('transfer in handlerPermanent has been triggered!');
    const transferMethod = this.registrarContract?.methods.transferFrom(
      this.address,
      toAddress,
      this.labelHash
    );
    const baseTx = {
      to: this.registrarAddress,
      from: this.address
    };
    console.log('transferMethod', transferMethod);
    const tx1 = Object.assign({}, baseTx, {
      data: this.setController(toAddress, true).encodeABI()
    });
    const tx2 = Object.assign({}, baseTx, {
      data: transferMethod.encodeABI()
    });
    console.log('tx1', tx1);
    console.log('tx2', tx2);
    return this.web3.mew.sendBatchTransactions([tx1, tx2]);
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
        this._setContentHash();
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
  }

  createCommitment() {
    const utils = this.web3.utils;
    const txObj = { from: this.address };
    const promiEvent = new EventEmitter();
    this.registrarControllerContract.methods
      .makeCommitmentWithConfig(
        this.parsedHostName,
        this.address,
        utils.sha3(this.secretPhrase),
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
    this._setExpiry();
  }

  async _setExpiry() {
    if (!this.isAvailable) {
      this.expired = this.expiryTime * 1000 < new Date().getTime();
      if (!this.expired) {
        const date = new Date(this.expiryTime * 1000);
        this.expiration =
          date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
      }
    }
    this._setDnsContract();
  }

  async _setDnsContract() {
    if (this.tld && this.tld !== this.network.type.ens.registrarTLD) {
      this.dnsRegistrarContract = new DNSRegistrar(
        this.web3.currentProvider,
        this.registrarAddress
      );
      this.dnsClaim = await this.dnsRegistrar.claim(this.parsedDomainName);
      this._setDnsInfo();
    }
    return;
  }
  async _setDnsInfo() {
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
      this.registrarControllerContract.methods
        .registerWithConfig(
          this.parsedHostName,
          this.address,
          this.getActualDuration(duration),
          utils.sha3(this.secretPhrase),
          this.publicResolverAddress,
          this.address
        )
        .send(txObj)
        .on('transactionHash', hash => promiEvent.emit('transactionHash', hash))
        .on('error', err => promiEvent.emit('error', err))
        .on('receipt', receipt => promiEvent.emit('receipt', receipt));
    });
    return promiEvent;
  }
}
