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
    if (super.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return new Promise((resolve, reject) => {
      try {
        _self
          ._createCommitment()
          .then(() => {
            _self._registerWithDuration(duration);
          })
          .then(() => {
            this._initModule(); // might need something more effecient than this
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  transfer(toAddress) {
    if (super.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return new Promise((resolver, reject) => {
      super
        .setController(toAddress)
        .then(() => {
          super.web3Val.eth
            .sendTransaction({
              from: super.addressVal,
              to: super.networkVal.type.ens.registry,
              data: super.registryContractVal.methods
                .setOwner(super.nameHashVal, toAddress)
                .encodeABI(),
              value: 0
            })
            .then(() => {
              resolver({ success: 'Domain transferred successfully' });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  renew(duration) {
    if (super.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (duration <= 0) {
      throw new Error('Invalid or missing parameter: Duration');
    }

    const hostName = super.nameVal.replace(
      `.${super.networkVal.type.ens.registrarTLD}`,
      ''
    );

    const ACTUAL_DURATION = Math.ceil(60 * 60 * 24 * 365.25 * duration);
    // Not sure where to place balance checker that's currently present
    return new Promise((resolve, reject) => {
      super.registrarControllerContractVal.methods
        .rentPrice(super.nameVal, ACTUAL_DURATION)
        .call()
        .then(res => {
          const data = super.registrarControllerContractVal.methods
            .renew(hostName)
            .encodeABI();
          const withFivePercent = BigNumber(res)
            .times(1.05)
            .integerValue()
            .toFixed();

          const txObj = {
            to: super.contractControllerAddressVal,
            from: super.addressVal,
            data: data,
            value: withFivePercent
          };

          super.web3Val
            .sendTransaction(txObj)
            .then(() => {
              resolve({ success: 'Name renewed successfully!' });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  releaseDeed() {
    if (super.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (!this.redeemable) {
      throw new Error('Name has no releasable deed!');
    }

    return new Promise((resolve, reject) => {
      if (this.deedOwnerVal !== super.addressVal) {
        return reject({
          error: 'Redeeming address provided is not the owner!'
        });
      }
      const data = this.oldDeedContract.methods
        .releaseDeed(super.labelHashVal)
        .encodeABI();
      const obj = {
        from: super.addressVal,
        to: OLD_ENS_ADDRESS,
        data: data,
        value: 0
      };

      super.web3Val.eth
        .sendTransaction(obj)
        .then(() => {
          resolve({ success: 'Deed released succesfully!' });
        })
        .catch(reject);
    });
  }

  setIPFS(file) {
    if (super.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (super.networkVal.type.name !== 'ETH') {
      throw new Error('Ipfs not supported in this network!');
    }

    return new Promise((resolve, reject) => {
      try {
        uploadFileToIpfs(file)
          .then(getHashFromFile)
          .then(hash => {
            const ipfsToHash = `0x${contentHash.fromIpfs(hash)}`;
            const tx = {
              from: super.addressVal,
              to: super.resolverAddressVal,
              data: super.resolverContractVal.methods
                .setContentHash(super.nameHashVal, ipfsToHash)
                .encodeABI(),
              value: 0
            };

            super.web3Val.eth.sendTransaction(tx).then(() => {
              return resolve({
                success:
                  'Transaction sent! Please wait a couple minutes to confirm changes'
              });
            });
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  // DNS claim name method
  claim() {
    return new Promise((resolve, reject) => {
      try {
        this.dnsClaimVal
          .submit({
            from: this.account.address
          })
          .then(resolve);
      } catch (e) {
        reject(e);
      }
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
      await super._initializeNameModuleVal
        .then(this._setDeeds)
        .then(this._setExpiry)
        .then(this._setContentHash)
        .then(this._setEnsContracts)
        .then(this._setDnsContract);
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setExpiry() {
    const expiryTime = await super.registrarContractVal.methods
      .nameExpires(super.labelHashVal)
      .call();
    this.expired = expiryTime * 1000 < new Date().getTime();
  }

  async _setContentHash() {
    try {
      const hash = await super.resolverContractVal.methods
        .contenthash(super.nameHashVal)
        .call();
      this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHash = '';
    }
  }

  async _setEnsContracts() {
    const web3 = super.web3Val;
    super._setContractsVal();
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
  }

  async _setDnsContract() {
    if (!super.name.includes(super.network.ens.registrarTLD)) {
      this.dnsRegistrarContractVal = new DNSRegistrar(
        super.web3Val.currentProvider,
        super.registrarAddressVal
      );
      this.dnsClaimVal = await this.dnsRegistrar.claim(
        super.parsedDomainNameVal
      );
      this._setDnsInfo();
    }

    return;
  }

  async _setDnsInfo() {
    const _owner = await super.ens.owner(super.parsedDomainNameVal);
    const isInNewRegistry = await super.registryContractVal.methods
      .recordExists(nameHashPckg.hash(super.parsedDomainNameVal))
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
    if (super.network.type.name === 'ETH') {
      const web3 = super.web3Val;
      const entries = await this.oldEnsContract.methods
        .entries(super.labelHashVal)
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
    const utils = super.web3Val.utils;
    const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
    const actualDuration = Math.ceil(SECONDS_YEAR * duration);
    try {
      const rentPrice = await super.registrarControllerContractVal.methods
        .rentPrice(super.parsedHostNameVal, actualDuration)
        .call();
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();
      return super.registrarControllerContractVal.methods
        .registerWithConfig(
          super.parsedHostNameVal,
          super.addressVal,
          actualDuration,
          utils.sha3(super.secretPhraseVal),
          super.publicResolverAddressVal,
          super.addressVal
        )
        .send({ from: super.addressVal, value: withFivePercent });
    } catch (e) {
      throw new Error(e);
    }
  }

  async _createCommitment() {
    const utils = super.web3Val.utils;
    try {
      const commitment = await super.registrarControllerContractVal.methods
        .makeCommitmentWithConfig(
          super.parsedHostNameVal,
          super.addressVal,
          utils.sha3(super.secretPhraseVal),
          super.publicResolverAddressVal,
          super.addressVal
        )
        .call();
      return await super.registrarControllerContractVal.methods
        .commit(commitment)
        .send({ from: super.addressVal });
    } catch (e) {
      throw new Error(e);
    }
  }
}
