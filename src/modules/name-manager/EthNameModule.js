import OldEnsAbi from './ABI/oldEnsAbi.js';
import OldDeedAbi from './ABI/oldDeedAbi.js';
import { uploadFileToIpfs, getHashFromFile } from './services';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import NameManagerInterface from './interface/NameManagerInterface';

const OLD_ENS_ADDRESS = '0x6090a6e47849629b7245dfa1ca21d94cd15878ef';
const BURNER_ADDRESS = '0x0000000000000000000000000000000000000000';

export default class EthNameModule extends NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    super(name, address, network, web3, ens);
    // Contracts
    this.oldEnsContract = null;
    this.oldDeedContract = null;

    this._initModule();
  }

  register(duration) {
    const _self = this;
    if (super.owner === '0x') {
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
    if (super.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    return new Promise((resolver, reject) => {
      super
        .setController(toAddress)
        .then(() => {
          super.web3.eth
            .sendTransaction({
              from: super.address,
              to: super.network.type.ens.registry,
              data: super.registryContract.methods
                .setOwner(super.nameHash, toAddress)
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
    if (super.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (duration <= 0) {
      throw new Error('Invalid or missing parameter: Duration');
    }

    const hostName = super.name.replace(
      `.${super.network.type.ens.registrarTLD}`,
      ''
    );

    const ACTUAL_DURATION = Math.ceil(60 * 60 * 24 * 365.25 * duration);
    // Not sure where to place balance checker that's currently present
    return new Promise((resolve, reject) => {
      super.registrarControllerContract.methods
        .rentPrice(super.name, ACTUAL_DURATION)
        .call()
        .then(res => {
          const data = super.registrarControllerContract.methods
            .renew(hostName)
            .encodeABI();
          const withFivePercent = BigNumber(res)
            .times(1.05)
            .integerValue()
            .toFixed();

          const txObj = {
            to: super.contractControllerAddress,
            from: super.address,
            data: data,
            value: withFivePercent
          };

          super.web3
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
    if (super.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (!this.redeemable) {
      throw new Error('Name has no releasable deed!');
    }

    return new Promise((resolve, reject) => {
      if (this.deedOwner !== super.address) {
        return reject({
          error: 'Redeeming address provided is not the owner!'
        });
      }
      const data = this.oldDeedContract.methods
        .releaseDeed(super.labelHash)
        .encodeABI();
      const obj = {
        from: super.address,
        to: OLD_ENS_ADDRESS,
        data: data,
        value: 0
      };

      super.web3.eth
        .sendTransaction(obj)
        .then(() => {
          resolve({ success: 'Deed released succesfully!' });
        })
        .catch(reject);
    });
  }

  setIPFS(file) {
    if (super.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    return new Promise((resolve, reject) => {
      try {
        uploadFileToIpfs(file)
          .then(getHashFromFile)
          .then(hash => {
            const ipfsToHash = `0x${contentHash.fromIpfs(hash)}`;
            const tx = {
              from: super.address,
              to: super.resolverAddress,
              data: super.resolverContract.methods
                .setContentHash(super.nameHash, ipfsToHash)
                .encodeABI(),
              value: 0
            };

            super.web3.eth.sendTransaction(tx).then(() => {
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

  async _initModule() {
    if (super.name === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    if (super.address === '0x') {
      throw new Error('Address not set! Please initialize module properly!');
    }
    if (!super.network) {
      throw new Error('Network not set! Please initialize module properly!');
    }
    if (!super.web3) {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    try {
      await super._initializeNameModule
        .then(this._setDeeds)
        .then(this._setExpiry)
        .then(this._setContentHash)
        .then(this._setEnsContracts);
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setExpiry() {
    const expiryTime = await super.registrarContract.methods
      .nameExpires(super.labelHash)
      .call();
    this.expired = expiryTime * 1000 < new Date().getTime();
  }

  async _setContentHash() {
    try {
      const hash = await super.resolverContract.methods
        .contenthash(super.nameHash)
        .call();
      this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHash = '';
    }
  }

  async _setEnsContracts() {
    const web3 = super.web3;
    super._setContracts();
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
  }

  async _setDeeds() {
    const web3 = super.web3;
    const entries = await this.oldEnsContract.methods
      .entries(super.labelHash)
      .call();
    if (entries[1] !== BURNER_ADDRESS) {
      this.redeemable = true;
      this.oldDeedContract = new web3.eth.Contract(OldDeedAbi, entries[1]);
      this.deedOwner = await this.oldDeedContract.methods.owner().call();
      this.deedValue = await this.oldDeedContract.methods.value().call();
    } else {
      this.redeemable = false;
    }
  }

  async _registerWithDuration(duration) {
    const utils = super.web3.utils;
    const SECONDS_YEAR = 60 * 60 * 24 * 365.25;
    const actualDuration = Math.ceil(SECONDS_YEAR * duration);
    try {
      const rentPrice = await super.registrarControllerContract.methods
        .rentPrice(super.parsedHostName, actualDuration)
        .call();
      const withFivePercent = BigNumber(rentPrice)
        .times(1.05)
        .integerValue()
        .toFixed();
      return super.registrarControllerContract.methods
        .registerWithConfig(
          super.parsedHostName,
          super.address,
          actualDuration,
          utils.sha3(super.secretPhrase),
          super.publicResolverAddress,
          super.address
        )
        .send({ from: super.address, value: withFivePercent });
    } catch (e) {
      throw new Error(e);
    }
  }

  async _createCommitment() {
    const utils = super.web3.utils;
    try {
      const commitment = await super.registrarControllerContract.methods
        .makeCommitmentWithConfig(
          super.parsedHostName,
          super.address,
          utils.sha3(super.secretPhrase),
          super.publicResolverAddress,
          super.address
        )
        .call();
      return await super.registrarControllerContract.methods
        .commit(commitment)
        .send({ from: super.address });
    } catch (e) {
      throw new Error(e);
    }
  }
}
