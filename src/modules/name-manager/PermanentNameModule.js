import OldEnsAbi from './ABI/oldEnsAbi.js';
import OldDeedAbi from './ABI/oldDeedAbi.js';
import { uploadFileToIpfs, getHashFromFile } from './services';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import NameManagerInterface from './interface/NameManagerInterface';
import * as nameHashPckg from 'eth-ens-namehash';

const OLD_ENS_ADDRESS = '0x6090a6e47849629b7245dfa1ca21d94cd15878ef';
const BURNER_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class PermanentNameModule extends NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    super(name, address, network, web3, ens);
    this.deedValueVal = 0;
    this.deedOwnerVal = '0x';
    this.secretPhraseVal = '';
    this.expirationVal = null;
    this.expiredVal = false;
    this.redeemableVal = false;
    // Contracts
    this.oldEnsContractVal = null;
    this.oldDeedContractVal = null;
    this.dnsRegistrarContractVal = null;
    this.dnsClaimVal = null;
    this.dnsStatusVal = '';

    this._initModule();
  }

  register(duration) {
    const _self = this;
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return _self
      ._createCommitment()
      .then(() => _self._registerWithDuration(duration))
      .then(() => this._initModule()); // might need something more effecient than this
  }

  transfer(toAddress) {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return this.setController(toAddress).then(() => {
      return this.web3Val.eth.sendTransaction({
        from: this.addressVal,
        to: this.networkVal.type.ens.registry,
        data: this.registryContractVal.methods
          .setOwner(this.nameHashVal, toAddress)
          .encodeABI(),
        value: 0
      });
    });
  }

  renew(duration) {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (duration <= 0) {
      throw new Error('Invalid or missing parameter: Duration');
    }

    const hostName = this.nameVal.replace(
      `.${this.networkVal.type.ens.registrarTLD}`,
      ''
    );

    const ACTUAL_DURATION = Math.ceil(60 * 60 * 24 * 365.25 * duration);
    // Not sure where to place balance checker that's currently present
    return this.registrarControllerContractVal.methods
      .rentPrice(this.nameVal, ACTUAL_DURATION)
      .call()
      .then(res => {
        const data = this.registrarControllerContractVal.methods
          .renew(hostName)
          .encodeABI();
        const withFivePercent = BigNumber(res)
          .times(1.05)
          .integerValue()
          .toFixed();

        const txObj = {
          to: this.contractControllerAddressVal,
          from: this.addressVal,
          data: data,
          value: withFivePercent
        };

        return this.web3Val.sendTransaction(txObj);
      });
  }

  releaseDeed() {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (!this.redeemable) {
      throw new Error('Name has no releasable deed!');
    }

    if (this.deedOwnerVal !== this.addressVal) {
      throw new Error('Redeeming address provided is not the owner!');
    }
    const data = this.oldDeedContract.methods
      .releaseDeed(this.labelHashVal)
      .encodeABI();
    const obj = {
      from: this.addressVal,
      to: OLD_ENS_ADDRESS,
      data: data,
      value: 0
    };

    return this.web3Val.eth.sendTransaction(obj);
  }

  setIPFS(file) {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (this.networkVal.type.name !== 'ETH') {
      throw new Error('Ipfs not supported in this network!');
    }

    return uploadFileToIpfs(file)
      .then(getHashFromFile)
      .then(hash => {
        const ipfsToHash = `0x${contentHash.fromIpfs(hash)}`;
        const tx = {
          from: this.addressVal,
          to: this.resolverAddressVal,
          data: this.resolverContractVal.methods
            .setContentHash(this.nameHashVal, ipfsToHash)
            .encodeABI(),
          value: 0
        };

        return this.web3Val.eth.sendTransaction(tx);
      });
  }

  // DNS claim name method
  claim() {
    return this.dnsClaimVal.submit({
      from: this.addressVal
    });
  }

  async _initModule() {
    // initial valaue for the variables
    const formValues = {
      deedValue: 'deedValueVal',
      deedOwner: 'deedOwnerVal',
      secretPhrase: 'secretPhraseVal',
      expiration: 'expirationVal',
      expired: 'expiredVal',
      redeemable: 'redeemableVal',
      // Contracts
      oldEnsContract: 'oldEnsContractVal',
      oldDeedContract: 'oldDeedContractVal',
      dnsRegistrarContract: 'dnsRegistrarContractVal',
      dnsClaim: 'dnsClaimVal',
      dnsStatus: 'dnsStatusVal'
    };

    Object.keys(formValues).forEach(propName => {
      Object.defineProperties(this, propName, {
        enumerable: true,
        get: () => {
          return this[formValues[propName]];
        },
        set: value => {
          this[formValues[propName]] = value;
        }
      });
    });
    try {
      await this._initializeNameModuleVal.then(() => {
        return Promise.all([
          this._setDeeds,
          this._setExpiry,
          this._setContentHash,
          this._setEnsContracts,
          this._setDnsContract
        ]);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setExpiry() {
    const expiryTime = await this.registrarContractVal.methods
      .nameExpires(this.labelHashVal)
      .call();
    this.expired = expiryTime * 1000 < new Date().getTime();
  }

  async _setContentHash() {
    try {
      const hash = await this.resolverContractVal.methods
        .contenthash(this.nameHashVal)
        .call();
      this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHash = '';
    }
  }

  async _setEnsContracts() {
    const web3 = this.web3Val;
    this._setContractsVal();
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
  }

  async _setDnsContract() {
    if (!this.name.includes(this.network.ens.registrarTLD)) {
      this.dnsRegistrarContractVal = new DNSRegistrar(
        this.web3Val.currentProvider,
        this.registrarAddressVal
      );
      this.dnsClaimVal = await this.dnsRegistrar.claim(
        this.parsedDomainNameVal
      );
      this._setDnsInfo();
    }

    return;
  }

  async _setDnsInfo() {
    const _owner = await this.ens.owner(this.parsedDomainNameVal);
    const isInNewRegistry = await this.registryContractVal.methods
      .recordExists(nameHashPckg.hash(this.parsedDomainNameVal))
      .call();
    if (this.dnsClaimVal.result.found && !isInNewRegistry) {
      this.dnsStatusVal = 'claimable';
    } else if (
      this.dnsClaimVal.result.found &&
      this.dnsClaimVal.getOwner().toLowerCase() === _owner.toLowerCase()
    ) {
      this.dnsStatusVal = 'owned';
    } else if (this.dnsClaimVal.result.found) {
      this.dnsStatusVal = 'claimable';
    } else if (this.dnsClaimVal.result.nsec) {
      this.dnsStatusVal = 'unclaimable';
    } else {
      this.dnsStatusVal = 'dnsecerror';
    }
  }

  async _setDeeds() {
    if (this.network.type.name === 'ETH') {
      const web3 = this.web3Val;
      const entries = await this.oldEnsContract.methods
        .entries(this.labelHashVal)
        .call();
      if (entries[1] !== BURNER_ADDRESS) {
        this.redeemable = true;
        this.oldDeedContract = new web3.eth.Contract(OldDeedAbi, entries[1]);
        this.deedOwnerVal = await this.oldDeedContract.methods.owner().call();
        this.deedValue = await this.oldDeedContract.methods.value().call();
      } else {
        this.redeemable = false;
      }
    }
    return;
  }

  async _registerWithDuration(duration) {
    const utils = this.web3Val.utils;
    const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
    const actualDuration = Math.ceil(SECONDS_YEAR * duration);
    try {
      const rentPrice = await this.registrarControllerContractVal.methods
        .rentPrice(this.parsedHostNameVal, actualDuration)
        .call();
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();
      return this.registrarControllerContractVal.methods
        .registerWithConfig(
          this.parsedHostNameVal,
          this.addressVal,
          actualDuration,
          utils.sha3(this.secretPhraseVal),
          this.publicResolverAddressVal,
          this.addressVal
        )
        .send({ from: this.addressVal, value: withFivePercent });
    } catch (e) {
      throw new Error(e);
    }
  }

  async _createCommitment() {
    const utils = this.web3Val.utils;
    try {
      const commitment = await this.registrarControllerContractVal.methods
        .makeCommitmentWithConfig(
          this.parsedHostNameVal,
          this.addressVal,
          utils.sha3(this.secretPhraseVal),
          this.publicResolverAddressVal,
          this.addressVal
        )
        .call();
      return this.registrarControllerContractVal.methods
        .commit(commitment)
        .send({ from: this.addressVal });
    } catch (e) {
      throw new Error(e);
    }
  }
}
