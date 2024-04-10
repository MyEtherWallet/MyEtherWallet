import { getTld, getHostName } from './helpers/helperTld';
import { decodeCoinAddress } from './helpers/helperMulticoin';
import BaseRegistrarImplementation from '@ensdomains/ens-contracts/deployments/mainnet/BaseRegistrarImplementation.json';
import ENSRegistry from '@ensdomains/ens-contracts/deployments/mainnet/ENSRegistry.json';
import PublicResolver from '@ensdomains/resolver/build/contracts/PublicResolver.json';
import ETHRegistrarController from '@ensdomains/ens-contracts/deployments/mainnet/ETHRegistrarController.json';
import multicoins from './handlerMulticoins';
import textrecords from './handlerTextRecords';
import registrarInterface from './configs/configRegistrarInterface';
import * as nameHashPckg from 'eth-ens-namehash';
import contentHash from 'content-hash';
import { toChecksumAddress } from 'web3-utils';
import { clone } from 'lodash';
import normalise from '@/core/helpers/normalise';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

export default class ENSManagerInterface {
  constructor(name, address, network, web3, ens) {
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.ensInstance = ens ? ens : null;
    this.nameInstance = ens ? ens.name(name) : null;
    // Returned value
    this.tld = getTld(name, network);
    this.parsedHostName = normalise(getHostName(name));
    this.name = normalise(this.parsedHostName + '.' + this.tld);
    this.nameHash = nameHashPckg.hash(this.name);
    this.subtext = '';
    this.txtRecords = null;
    this.multiCoin = null;
    this.labelHash = web3.utils.sha3(this.parsedHostName);
    this.owner = '0x';

    this.contentHash = '';
    this.textRecordSupport = false;
    this.multicoinSupport = false;
    this.isAvailable = false;
    this.isController = false;
    this.checkingDomainAvail = true;

    // Addresses
    this.mainResolvingAddress = '';
    this.registrarAddress = '0x';
    this.contractControllerAddress = '0x';
    this.resolverAddress = '0x';
    this.publicResolverAddress = '0x';
    this.controllerAddress = '0x';

    // Contracts
    this.publicResolverContract = null;
    this.registrarContract = null;
    this.registryContract = null;
    this.registrarControllerContract = null;
    this.resolverContract = null;

    this._init();
  }

  setController(address, returnObj = false) {
    const actualToAddress = address === '' ? this.address : address;
    const tx = this.registrarContract.methods.reclaim(
      this.labelHash,
      actualToAddress
    );
    if (returnObj) return tx;
    return tx.send({ from: this.address });
  }

  migrate() {
    if (this.publicResolverAddress === this.resolverAddress) {
      return false;
    }
    return this.registryContract.methods
      .setResolver(this.nameHash, this.publicResolverAddress)
      .send({ from: this.address })
      .then(() => {
        return this._migrateCoinsAndRecords();
      });
  }
  // not migrating this to v2 library
  // as it will cost user more
  // for editing multiple records
  async setMulticoin(coins) {
    // const isMigrate = await this.migrate();
    // if (isMigrate) return;
    const coinaddresses = coins.map(item => {
      return this.publicResolverContract.methods
        .setAddr(this.nameHash, item.id, decodeCoinAddress(item))
        .encodeABI();
    });
    return this.publicResolverContract.methods
      .multicall(coinaddresses)
      .send({ from: this.address })
      .on('receipt', this._getMulticoins);
  }

  // not migrating this to v2 library
  // as it will cost user more
  // for editing multiple records
  async setTxtRecord(obj) {
    if (this.address === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    for (const _record in obj) {
      this.txtRecords[_record] = obj[_record];
    }
    // const isMigrate = await this.migrate();
    // if (isMigrate) return;

    const multicalls = [];
    for (const i in obj) {
      multicalls.push(
        this.resolverContract.methods
          .setText(this.nameHash, i.toLowerCase(), obj[i])
          .encodeABI()
      );
    }
    return this.resolverContract.methods
      .multicall(multicalls)
      .send({ from: this.address })
      .on('receipt', this._getTxtRecords);
  }

  async _init() {
    if (this.name === '') {
      throw new Error('Name not set! Please initialize module properly!');
    }
    if (this.address === '0x') {
      throw new Error('Address not set! Please initialize module properly!');
    }
    if (!this.network) {
      throw new Error('Network not set! Please initialize module properly!');
    }
    if (!this.web3) {
      throw new Error('Web3 not set! Please initialize module properly!');
    }
    // initialize values
    const values = {
      address: 'address',
      network: 'network',
      web3: 'web3',
      ens: 'ens',
      name: 'name',
      txtRecords: 'txtRecords',
      multiCoin: 'multiCoin',
      labelHash: 'labelHash',
      owner: 'owner',
      registrarAddress: 'registrarAddress',
      contractControllerAddress: 'contractControllerAddress',
      resolverAddress: 'resolverAddress',
      publicResolverAddress: 'publicResolverAddress',
      contentHash: 'contentHash',
      textRecordSupport: 'textRecordSupport',
      multicoinSupport: 'multicoinSupport',
      publicResolverContract: 'publicResolverContract',
      registrarContract: 'registrarContract',
      registryContract: 'registryContract',
      registrarControllerContract: 'registrarControllerContract',
      resolverContract: 'resolverContract',
      isAvailable: 'isAvailable',
      mainResolvingAddress: 'mainResolvingAddress',
      subtext: 'subtext'
    };
    // create a setter and getter methods for all the variables
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
      this._setRegistrar();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Internal methods
   * Convert to private methods once transitioned to Typescript
   */
  async _setRegistrar() {
    const registryAddress = this.network.type.ens.registry;
    this.registryContract = new this.web3.eth.Contract(
      ENSRegistry.abi,
      registryAddress
    );
    const nameInstance = await this.ensInstance.name(this.tld);
    this.registrarAddress = await nameInstance.getOwner();
    this._setRegistrarContracts();
  }

  async _setRegistrarContracts() {
    const web3 = this.web3;
    this.registrarContract = new this.web3.eth.Contract(
      BaseRegistrarImplementation.abi,
      BaseRegistrarImplementation.address
    );
    try {
      this.contractControllerAddress = ETHRegistrarController.address;
      this.registrarControllerContract = new web3.eth.Contract(
        ETHRegistrarController.abi,
        ETHRegistrarController.address
      );
    } catch (e) {
      throw new Error(e);
    }
    this._isDomainAvailable();
  }

  async _isDomainAvailable() {
    this.isAvailable = await this.registrarControllerContract.methods
      .available(this.parsedHostName)
      .call();
    this.checkingDomainAvail = false;
    this._setPublicResolverAddress();
  }

  async _getContentHash() {
    try {
      const hash = await this.resolverContract.methods
        .contenthash(this.nameHash)
        .call();
      this.contentHash = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHash = '';
    }
  }

  async _getOwner() {
    try {
      this.owner = await this.registrarContract.methods
        .ownerOf(this.labelHash)
        .call();
    } catch (e) {
      this.owner = '0x';
    }
  }

  async _setPublicResolverAddress() {
    try {
      const nameInstance = this.ensInstance.name('resolver.eth');
      this.publicResolverAddress = await nameInstance.getAddress();
    } catch (e) {
      this.publicResolverAddress = '0x';
    }
    this._setResolverContracts();
  }

  async _setResolverContracts() {
    const web3 = this.web3;
    this.resolverAddress = await this.ensInstance.ens.resolver(this.nameHash);
    this.resolverContract = new web3.eth.Contract(
      PublicResolver.abi,
      this.resolverAddress
    );

    this.publicResolverContract = new web3.eth.Contract(
      PublicResolver.abi,
      this.publicResolverAddress
    );
    this._getMoreInfo();
  }

  async _getMoreInfo() {
    if (!this.isAvailable) {
      this._getOwner();
      this._getContentHash();
      this._getTxtRecords();
      this._checkController();
      this._getMulticoins();
      this._getMainResolvingAddress();
    }
  }

  async _getTxtRecords() {
    try {
      const supportsTxt = await this.resolverContract.methods
        .supportsInterface(registrarInterface.TEXT_RECORD)
        .call();
      this.textRecordSupport = supportsTxt;
      if (supportsTxt) {
        this.txtRecords = {};
        const promises = [];
        textrecords.forEach(txt => {
          promises.push(this.nameInstance.getText(txt.name));
        });
        Promise.all(promises).then(vals => {
          vals.forEach((val, idx) => {
            this.txtRecords[textrecords[idx].name] = val;
          });
        });
      }
    } catch {
      this.textRecordSupport = false;
    }
  }

  async _checkController() {
    // checks the controller of the name
    const owner = await this.registryContract.methods
      .owner(this.nameHash)
      .call();
    this.controllerAddress = owner;
    this.isController =
      this.web3.utils.toChecksumAddress(owner) ===
      this.web3.utils.toChecksumAddress(this.address);
  }
  _getMainResolvingAddress() {
    this.ensInstance.ens
      .resolver(this.nameHash)
      .then(addr => {
        this.mainResolvingAddress = toChecksumAddress(addr);
        this.subtext = this.mainResolvingAddress;
      })
      .catch(err => Toast(err, {}, ERROR));
  }
  async _getMulticoins() {
    const newObj = {};
    Object.keys(multicoins).forEach(item => {
      newObj[item] = clone(multicoins[item]);
    });
    this.multiCoin = newObj;
    try {
      const supportMultiCoin = await this.resolverContract.methods
        .supportsInterface(registrarInterface.MULTICOIN)
        .call();
      for (const type in this.multiCoin) this.multiCoin[type].value = '';
      if (supportMultiCoin) {
        this.multicoinSupport = supportMultiCoin;
        const promises = [];
        const coinTypes = Object.keys(this.multiCoin);
        coinTypes.forEach(type => {
          promises.push(
            this.nameInstance.getAddress(this.multiCoin[type].symbol)
          );
        });
        await Promise.all(promises).then(vals => {
          vals.forEach((address, idx) => {
            if (
              address &&
              address !== '0x0000000000000000000000000000000000000000'
            ) {
              const formattedAddress =
                coinTypes[idx] === 'ETH' || coinTypes[idx] === 'ETC'
                  ? Buffer.from(address.replace('0x', ''), 'hex')
                  : this.multiCoin[coinTypes[idx]].decode(address);
              const value =
                this.multiCoin[coinTypes[idx]].encode(formattedAddress);
              this.multiCoin[coinTypes[idx]].value = value;
            }
          });
        });
      } else {
        this.multiCoin.ETH.value = await this.nameInstance.getAddress('ETH');
      }
    } catch (e) {
      this.multiCoin.ETH.value = '0x';
    }
  }

  async _migrateCoinsAndRecords() {
    const multicallRecords = [];
    try {
      for (const coin in this.multiCoin) {
        if (this.multiCoin[coin].value) {
          multicallRecords.push(
            this.publicResolverContract.methods
              .setAddr(
                this.nameHash,
                this.multiCoin[coin].id,
                decodeCoinAddress(this.multiCoin[coin])
              )
              .encodeABI()
          );
        }
      }
      for (const txt in this.txtRecords) {
        if (this.txtRecords[txt]) {
          multicallRecords.push(
            this.resolverContract.methods
              .setText(this.nameHash, txt, this.txtRecords[txt])
              .encodeABI()
          );
        }
      }
      this.publicResolverContract.methods
        .multicall(multicallRecords)
        .send({ from: this.address });
    } catch (e) {
      throw new Error(e);
    }
  }
}
