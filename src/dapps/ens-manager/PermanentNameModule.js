import OldEnsAbi from './ABI/oldEnsAbi.js';
import OldDeedAbi from './ABI/oldDeedAbi.js';
import getHashFromFile from './manage/services/getHashFromFile.js';
import uploadFileToIpfs from './manage/services/uploadFileToIpfs.js';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import ENSManagerInterface from './ENSManagerInterface.js';
import * as nameHashPckg from 'eth-ens-namehash';
import DNSRegistrar from '@ensdomains/dnsregistrar';

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

    this._initModule();
  }

  register(duration) {
    const _self = this;
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return _self
      ._createCommitment()
      .then(() => _self._registerWithDuration(duration))
      .then(() => this._initModule()); // might need something more effecient than this
  }

  transfer(toAddress) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return this.setController(toAddress).then(() => {
      return this.web3.eth.sendTransaction({
        from: this.address,
        to: this.network.type.ens.registry,
        data: this.registryContract.methods
          .setOwner(this.nameHash, toAddress)
          .encodeABI(),
        value: 0
      });
    });
  }

  renew(duration) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (duration <= 0) {
      throw new Error('Invalid or missing parameter: Duration');
    }

    const hostName = this.name.replace(
      `.${this.network.type.ens.registrarTLD}`,
      ''
    );

    const ACTUAL_DURATION = Math.ceil(60 * 60 * 24 * 365.25 * duration);
    // Not sure where to place balance checker that's currently present
    return this.registrarControllerContract.methods
      .rentPrice(this.name, ACTUAL_DURATION)
      .call()
      .then(res => {
        const data = this.registrarControllerContract.methods
          .renew(hostName)
          .encodeABI();
        const withFivePercent = BigNumber(res)
          .times(1.05)
          .integerue()
          .toFixed();

        const txObj = {
          to: this.contractControllerAddress,
          from: this.address,
          data: data,
          value: withFivePercent
        };

        return this.web3.sendTransaction(txObj);
      });
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

  setIPFS(file) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (this.network.type.name !== 'ETH') {
      throw new Error('Ipfs not supported in this network!');
    }

    return uploadFileToIpfs(file)
      .then(getHashFromFile)
      .then(hash => {
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
      });
  }

  // DNS claim name method
  claim() {
    return this.dnsClaim.submit({
      from: this.address
    });
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
      const promises = await Promise.all([
        this._setDeeds(),
        this._setExpiry(),
        this._setContentHash(),
        this._setEnsContracts(),
        this._setDnsContract()
      ]);
      return promises;
    } catch (e) {
      console.error('e', e)
      throw new Error(e);
    }
  }

  async _setExpiry() {
    const expiryTime = await this.registrarContract.methods
      .nameExpires(this.labelHash)
      .call();
    this.expired = expiryTime * 1000 < new Date().getTime();
  }

  async _setContentHash() {
    try {
      const hash = await this.resolverContract.methods
        .contenthash(this.nameHash)
        .call();
      this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHash = '';
    }
  }

  async _setEnsContracts() {
    const web3 = this.web3;
    this._setContracts();
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
  }

  async _setDnsContract() {
    if (!this.name.includes(this.network.ens.registrarTLD)) {
      this.dnsRegistrarContract = new DNSRegistrar(
        this.web3.currentProvider,
        this.registrarAddress
      );
      this.dnsClaim = await this.dnsRegistrar.claim(
        this.parsedDomainName
      );
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
    return;
  }

  async _registerWithDuration(duration) {
    const utils = this.web3.utils;
    const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
    const actualDuration = Math.ceil(SECONDS_YEAR * duration);
    try {
      const rentPrice = await this.registrarControllerContract.methods
        .rentPrice(this.parsedHostName, actualDuration)
        .call();
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerue()
        .toFixed();
      return this.registrarControllerContract.methods
        .registerWithConfig(
          this.parsedHostName,
          this.address,
          actualDuration,
          utils.sha3(this.secretPhrase),
          this.publicResolverAddress,
          this.address
        )
        .send({ from: this.address, value: withFivePercent });
    } catch (e) {
      throw new Error(e);
    }
  }

  async _createCommitment() {
    const utils = this.web3.utils;
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
      return this.registrarControllerContract.methods
        .commit(commitment)
        .send({ from: this.address });
    } catch (e) {
      throw new Error(e);
    }
  }
}
