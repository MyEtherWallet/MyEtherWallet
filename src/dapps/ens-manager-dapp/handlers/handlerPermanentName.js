import OldEnsAbi from './abi/abiOldEns.js';
import OldDeedAbi from './abi/abiOldDeed.js';
import { getHashFromFile, uploadFileToIpfs } from './helpers/helperIpfs.js';
import BigNumber from 'bignumber.js';
import ENSManagerInterface from './handlerENSManagerInterface.js';
import * as nameHashPckg from 'eth-ens-namehash';
import DNSRegistrar from '@ensdomains/dnsregistrar';
import contentHash from 'content-hash';
const bip39 = require('bip39');
const OLD_ENS_ADDRESS = '0x6090a6e47849629b7245dfa1ca21d94cd15878ef';
const BURNER_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class PermanentNameModule extends ENSManagerInterface {
  constructor(name, address, network, web3, ens) {
    super(name, address, network, web3, ens);
    this.deed = 0;
    this.deedOwner = '0x';
    this.secretPhrase = '';
    this.expiration = null;
    this.expired = false;
    this.redeemable = false;
    // Contracts
    this.oldEnsContract = null;
    this.oldDeedContract = null;
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
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return this.setController(toAddress).then(() => {
      return this.web3.eth.sendTransaction({
        from: this.address,
        to: this.network.type.ens.registry,
        data: this.registrarContract.methods
          .transferFrom(this.address, toAddress, this.labelHash)
          .encodeABI(),
        value: 0
      });
    });
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
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    const rentPrice = await this.getRentPrice(duration);

    const hasBalance = new BigNumber(rentPrice).lte(balance);
    if (!hasBalance) {
      throw new Error('Not enough balance');
    }
    const data = this.registrarControllerContract.methods
      .renew(this.parsedHostName, this.getActualDuration(duration))
      .encodeABI();
    const withFivePercent = BigNumber(rentPrice)
      .times(1.05)
      .integerValue()
      .toFixed();

    const txObj = {
      to: this.contractControllerAddress,
      from: this.address,
      data: data,
      value: withFivePercent
    };
    return this.web3.eth.sendTransaction(txObj);
  }

  releaseDeed() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (!this.redeemable) {
      throw new Error('Name has no releasable deed!');
    }

    if (this.deedOwner !== this.address) {
      throw new Error('Redeeming address provided is not the owner!');
    }
    const data = this.oldDeedContract.methods
      .releaseDeed(this.labelHash)
      .encodeABI();
    const obj = {
      from: this.address,
      to: OLD_ENS_ADDRESS,
      data: data,
      value: 0
    };

    return this.web3.eth.sendTransaction(obj);
  }

  uploadFile(file) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (this.network.type.name !== 'ETH') {
      throw new Error('Ipfs not supported in this network!');
    }

    return uploadFileToIpfs(file)
      .then(getHashFromFile)
      .then(hash => {
        return hash;
      });
  }

  setIPFSHash(hash) {
    const ipfsToHash = `0x${contentHash.fromIpfs(hash)}`;
    const tx = {
      from: this.address,
      to: this.resolverAddress,
      data: this.resolverContract.methods
        .setContentHash(this.nameHash, ipfsToHash)
        .encodeABI(),
      value: 0
    };

    return this.web3.eth.sendTransaction(tx);
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

  async createCommitment() {
    const utils = this.web3.utils;
    const txObj = { from: this.address };
    try {
      const commitment = await this.registrarControllerContract.methods
        .makeCommitmentWithConfig(
          this.parsedHostName,
          this.address,
          utils.sha3(this.secretPhrase),
          this.publicResolverAddress,
          this.address
        )
        .call();
      return this.web3.eth.estimateGas(txObj).then(gas => {
        txObj.gas = gas;
        return this.registrarControllerContract.methods
          .commit(commitment)
          .send(txObj);
      });
    } catch (e) {
      throw new Error(e);
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
      deed: 'deed',
      deedOwner: 'deedOwner',
      secretPhrase: 'secretPhrase',
      expiration: 'expiration',
      expired: 'expired',
      redeemable: 'redeemable',
      // Contracts
      oldEnsContract: 'oldEnsContract',
      oldDeedContract: 'oldDeedContract',
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
    try {
      return this._setEnsContracts();
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setExpiry() {
    if (!this.isAvailable) {
      const expiryTime = await this.registrarContract.methods
        .nameExpires(this.labelHash)
        .call();
      this.expired = expiryTime * 1000 < new Date().getTime();
      if (!this.expired) {
        const date = new Date(expiryTime * 1000);
        this.expiration =
          date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
      }
    }
    this._setDnsContract();
  }

  async _setEnsContracts() {
    const web3 = this.web3;
    // this._setContracts();
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
    this._setDeeds();
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

  async _setDeeds() {
    if (this.network.type.name === 'ETH') {
      const web3 = this.web3;
      const entries = await this.oldEnsContract.methods
        .entries(this.labelHash)
        .call();
      if (entries[1] !== BURNER_ADDRESS) {
        this.redeemable = true;
        this.oldDeedContract = new web3.eth.Contract(OldDeedAbi, entries[1]);
        this.deedOwner = await this.oldDeedContract.methods.owner().call();
        this.deed = await this.oldDeedContract.methods.value().call();
      } else {
        this.redeemable = false;
      }
    }
    return this._setExpiry();
  }

  async _registerWithDuration(duration, balance) {
    const utils = this.web3.utils;
    try {
      const rentPrice = await this.getRentPrice(duration);

      const hasBalance = new BigNumber(rentPrice).gte(balance);

      if (!hasBalance) {
        throw new Error('Not enough balance');
      }
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();

      const txObj = {
        from: this.address,
        value: withFivePercent
      };

      return this.web3.eth.estimateGas(txObj).then(gas => {
        txObj.gas = gas;
        return this.registrarControllerContract.methods
          .registerWithConfig(
            this.parsedHostName,
            this.address,
            this.getActualDuration(duration),
            utils.sha3(this.secretPhrase),
            this.publicResolverAddress,
            this.address
          )
          .send(txObj);
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
