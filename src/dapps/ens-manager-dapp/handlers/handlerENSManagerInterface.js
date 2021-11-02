import { getTld, getHostName } from './helpers/helperTld';
import { decodeCoinAddress } from './helpers/helperMulticoin';
import RegistryAbi from './abi/abiRegistry.js';
import BaseRegistrarAbi from './abi/abiBaseRegistrar.js';
import ResolverAbi from './abi/abiResolver.js';
import RegistrarControllerAbi from './abi/abiRegistrarController.js';
import multicoins from './handlerMulticoins';
import textrecords from './handlerTextRecords';
import registrarInterface from './configs/configRegistrarInterface';
import * as nameHashPckg from 'eth-ens-namehash';
import contentHash from 'content-hash';
import { toChecksumAddress } from 'web3-utils';
import { clone } from 'underscore';
import normalise from '@/core/helpers/normalise';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

export default class ENSManagerInterface {
  constructor(name, address, network, web3, ens) {
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.ens = ens ? ens : null;
    // Returned value
    this.tld = getTld(name, network);
    this.parsedHostName = normalise(getHostName(name));
    this.name = normalise(this.parsedHostName + '.' + this.tld);
    this.nameHash = nameHashPckg.hash(this.name);
    this.subtext = '';
    this.mainResolvingAddress = '';
    this.txtRecords = null;
    this.multiCoin = null;
    this.labelHash = web3.utils.sha3(this.parsedHostName);
    this.owner = '0x';
    this.registrarAddress = '0x';
    this.contractControllerAddress = '0x';
    this.resolverAddress = '0x';
    this.publicResolverAddress = '0x';
    this.controllerAddress = '0x';
    this.contentHash = '';
    this.textRecordSupport = false;
    this.multicoinSupport = false;
    this.isAvailable = false;
    this.isController = false;
    this.checkingDomainAvail = true;

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
  async setMulticoin(coins) {
    const isMigrate = await this.migrate();
    if (isMigrate) return;
    const coinaddresses = coins.map(item => {
      return this.publicResolverContract.methods
        .setAddr(this.nameHash, item.id, decodeCoinAddress(item))
        .encodeABI();
    });
    return this.publicResolverContract.methods
      .multicall(coinaddresses)
      .send({ from: this.address })
      .on('receipt', this._setMulticoins);
  }

  async setTxtRecord(obj) {
    if (this.address === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    for (const _record in obj) {
      this.txtRecords[_record] = obj[_record];
    }
    const isMigrate = await this.migrate();
    if (isMigrate) return;

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
      .on('receipt', this._setTxtRecords);
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
      this._setRegistar();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Internal methods
   * Convert to private methods once transitioned to Typescript
   */
  async _setRegistar() {
    const web3 = this.web3;
    const registryAddress = this.network.type.ens.registry;
    this.registryContract = new web3.eth.Contract(RegistryAbi, registryAddress);
    this.registrarAddress = await this.ens.owner(this.tld);
    this._setRegistrarContracts();
  }

  async _setRegistrarContracts() {
    const web3 = this.web3;
    const abi = BaseRegistrarAbi;
    this.registrarContract = new web3.eth.Contract(abi, this.registrarAddress);
    try {
      this.contractControllerAddress = await this.ens
        .resolver(this.tld, ResolverAbi)
        .interfaceImplementer(registrarInterface.CONTROLLER);
      this.registrarControllerContract = new web3.eth.Contract(
        RegistrarControllerAbi,
        this.contractControllerAddress
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

  async _setOwner() {
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
      const resolver = await this.ens.resolver('resolver.eth');
      this.publicResolverAddress = await resolver.addr();
    } catch (e) {
      this.publicResolverAddress = '0x';
    }
    this._setResolverContracts();
  }

  async _setResolverContracts() {
    const web3 = this.web3;
    this.resolverAddress = await this.registryContract.methods
      .resolver(this.nameHash)
      .call();
    this.resolverContract = new web3.eth.Contract(
      ResolverAbi,
      this.resolverAddress
    );
    this.publicResolverContract = new web3.eth.Contract(
      ResolverAbi,
      this.publicResolverAddress
    );
    this._setMoreInfo();
  }

  async _setMoreInfo() {
    if (!this.isAvailable) {
      this._setOwner();
      this._setContentHash();
      this._setTxtRecords();
      this._checkController();
      this._setMulticoins();
      this._setMainResolvingAddress();
    }
  }

  async _setTxtRecords() {
    try {
      const supportsTxt = await this.resolverContract.methods
        .supportsInterface(registrarInterface.TEXT_RECORD)
        .call();
      this.textRecordSupport = supportsTxt;
      if (supportsTxt) {
        this.txtRecords = {};
        const promises = [];
        textrecords.forEach(txt => {
          promises.push(
            this.resolverContract.methods.text(this.nameHash, txt.name).call()
          );
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
  _setMainResolvingAddress() {
    this.ens
      .resolver(this.name)
      .addr()
      .then(addr => {
        this.mainResolvingAddress = toChecksumAddress(addr);
        this.subtext = this.mainResolvingAddress;
      })
      .catch(err => Toast(err, {}, ERROR));
  }
  async _setMulticoins() {
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
            this.ens
              .resolver(this.name, ResolverAbi)
              .addr(this.multiCoin[type].id)
          );
        });
        await Promise.all(promises).then(vals => {
          vals.forEach((address, idx) => {
            if (address) {
              this.multiCoin[coinTypes[idx]].value = this.multiCoin[
                coinTypes[idx]
              ].encode(Buffer.from(address.replace('0x', ''), 'hex'));
            }
          });
        });
      } else {
        this.multiCoin.ETH.value = await this.ens.resolver(this.name).addr();
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
