import { getTld, getHostName, decodeCoinAddress } from './helpers/helperTld';
import RegistryAbi from './abi/abiRegistry.js';
import BaseRegistrarAbi from './abi/abiBaseRegistrar.js';
import ResolverAbi from './abi/abiResolver.js';
import FifsRegistrarAbi from './abi/abiFifsRegistrar.js';
import RegistrarControllerAbi from './abi/abiRegistrarController.js';
import multicoins from './handlerMulticoins';
import textrecords from './handlerTextRecords';
import supportedCoins from './handlerSupportedCoins';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import registrarInterface from './configs/configRegistrarInterface';
import * as nameHashPckg from 'eth-ens-namehash';
import contentHash from 'content-hash';

const REGISTRAR_TYPES = {
  FIFS: 'fifs',
  PERMANENT: 'permanent'
};
export default class ENSManagerInterface {
  constructor(name, address, network, web3, ens, gasPrice) {
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.ens = ens ? ens : null;
    this.gasPrice = gasPrice ? gasPrice : null;
    // Returned value
    this.tld = getTld(name);
    this.registrarTLD = this.tld
      ? this.tld
      : this.network.type.ens.registrarTLD;
    this.name = !this.tld ? name + '.' + this.registrarTLD : name;
    this.nameHash = nameHashPckg.hash(name);
    this.txtRecords = null;
    this.multiCoin = null;
    this.parsedHostName = getHostName(name);
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
    this.supportedCoins = supportedCoins;
    this.checkingDomainAvail = true;

    // Contracts
    this.publicResolverContract = null;
    this.registrarContract = null;
    this.registryContract = null;
    this.registrarControllerContract = null;
    this.resolverContract = null;

    this._init();
  }

  setController(address) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    const actualToAddress = address === '' ? this.address : address;
    const setControllerTx = {
      from: this.address,
      to: this.registrarAddress,
      data: this.registrarContract.methods
        .reclaim(this.labelHash, actualToAddress)
        .encodeABI(),
      gas: '500000',
      value: 0
    };
    return this.web3.eth.sendTransaction(setControllerTx);
  }

  migrate() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (this.publicResolverAddress === this.resolverAddress) {
      throw new 'Name migrated succesfully!'();
    }
    const setResolverTx = {
      from: this.address,
      to: this.network.type.ens.registry,
      data: this.registryContract.methods
        .setResolver(this.nameHash, this.publicResolverAddress)
        .encodeABI(),
      value: 0
    };

    return this.web3.sendTransaction(setResolverTx).then(() => {
      return this._migrateCoinsAndRecords();
    });
  }

  setMulticoin(coin) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    this.migrate().then(res => {
      if (res.hasOwProperty('success')) return true;

      const arr = coin.map(item => {
        return this.publicResolverContract.methods.setAddr(
          this.nameHash,
          item.id,
          decodeCoinAddress(item)
        );
      });

      const setAddrTx = {
        from: this.address,
        to: this.publicResolverAddress,
        data: this.publicResolverContract.methods.multicall(arr).encodeABI(),
        value: 0,
        gas: 100000
      };
      return this.web3.eth.sendTransaction(setAddrTx);
    });
  }

  setTxtRecord(obj) {
    if (this.address === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    for (const _record in obj) {
      this.txtRecords[_record] = obj[_record];
    }
    return this.migrate().then(res => {
      if (res.hasOwProperty('success')) return;
      const multicalls = [];
      for (const i in obj) {
        multicalls.push(
          this.resolverContract.methods
            .setText(this.nameHash, i.toLowerCase(), obj[i])
            .encodeABI()
        );
      }
      const tx = {
        from: this.address,
        to: this.publicResolverAddress,
        data: this.resolverContract.methods.multicall(multicalls).encodeABI(),
        gasPrice: BigNumber(utils.toWei(this.gasPrice, 'gwei')).toFixed(),
        value: 0
      };
      return this.web3.eth.sendTransaction(tx);
    });
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
      isAvailable: 'isAvailable'
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
  async _setRegistar() {
    const web3 = this.web3;
    const registryAddress = this.network.type.ens.registry;
    this.registryContract = new web3.eth.Contract(RegistryAbi, registryAddress);
    this.registrarAddress = await this.ens.owner(this.registrarTLD);
    this._setRegistrarContracts();
  }

  async _setRegistrarContracts() {
    const web3 = this.web3;
    const abi =
      this.network.type.ens.registrarType === REGISTRAR_TYPES.FIFS
        ? FifsRegistrarAbi
        : BaseRegistrarAbi;
    this.registrarContract = new web3.eth.Contract(abi, this.registrarAddress);
    if (this.network.type.ens.registrarType === REGISTRAR_TYPES.PERMANENT) {
      try {
        this.contractControllerAddress = await this.ens
          .resolver(this.registrarTLD, ResolverAbi)
          .interfaceImplementer(registrarInterface.CONTROLLER);
        this.registrarControllerContract = new web3.eth.Contract(
          RegistrarControllerAbi,
          this.contractControllerAddress
        );
      } catch (e) {
        throw new Error(e);
      }
    }
    this._isDomainAvailable();
  }

  async _isDomainAvailable() {
    const type = this.network.type.ens.registrarType;
    const isSubDomain = this.name.split('.').length > 2;

    if (type === REGISTRAR_TYPES.FIFS && !isSubDomain) {
      const expiryTime = await this.registrarContract.methods
        .expiryTimes(this.labelHash)
        .call();
      this.isAvailable = expiryTime * 1000 < new Date().getTime();
    } else if (type === REGISTRAR_TYPES.PERMANENT && !isSubDomain) {
      this.isAvailable = await this.registrarControllerContract.methods
        .available(this.parsedHostName)
        .call();
    }
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
    const isSubDomain = this.name.split('.').length > 2;
    const type = this.network.type.ens.registrarType;
    try {
      if (!isSubDomain && type === REGISTRAR_TYPES.PERMANENT) {
        this.owner = await this.registrarContract.methods
          .ownerOf(this.labelHash)
          .call();
      } else {
        this.owner = await this.ens.owner(this.name);
      }
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
    }
  }

  async _setTxtRecords() {
    try {
      const supportsTxt = await this.resolverContract.methods
        .supportsInterface(registrarInterface.TEXT_RECORD)
        .call();
      console.error('does it support txt', supportsTxt);
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

  async _setMulticoins() {
    try {
      const supportMultiCoin = await this.resolverContract.methods
        .supportsInterface(registrarInterface.MULTICOIN)
        .call();
      for (const type in this.supportedCoins)
        this.supportedCoins[type].value = '';
      if (supportMultiCoin) {
        const promises = [];
        const coinTypes = Object.keys(this.supportedCoins);
        coinTypes.forEach(type => {
          promises.push(
            this.ens
              .resolver(this.name, ResolverAbi)
              .addr(this.supportedCoins[type].id)
          );
        });
        await Promise.all(promises).then(vals => {
          vals.forEach((address, idx) => {
            if (address) {
              this.supportedCoins[coinTypes[idx]].value = this.supportedCoins[
                coinTypes[idx]
              ].encode(new Buffer(address.replace('0x', ''), 'hex'));
            }
          });
        });
      } else {
        this.supportedCoins.ETH.value = await this.ens
          .resolver(this.name)
          .addr();
      }
    } catch (e) {
      this.supportedCoins.ETH.value = '0x';
    }
  }

  async _migrateCoinsAndRecords() {
    const multicallRecords = [];
    try {
      for (const coin in multicoins) {
        if (multicoins[coin].value) {
          multicallRecords.push(
            this.publicResolverContract.methods
              .setAddr(
                this.nameHash,
                multicoins[coin].id,
                decodeCoinAddress(multicoins[coin])
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

      const txObj = {
        from: this.address,
        to: this.publicResolverAddress,
        data: this.publicResolverContract.methods
          .multicall(multicallRecords)
          .encodeABI(),
        value: 0
      };

      return this.web3.sendTransaction(txObj);
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setRecords() {
    try {
      const supportsMulticoin = await this.resolverContract.methods
        .supportsInterface(registrarInterface.MULTICOIN)
        .call();
      for (const type in multicoins) {
        multicoins[type].value = '';
      }

      if (supportsMulticoin) {
        const types = Object.keys(multicoins);
        const promises = types.map(type => {
          return this.ens
            .resolver(this.name, ResolverAbi)
            .addr(multicoins[type].id);
        });
        this.multicoinSupport = supportsMulticoin;
        this.multiCoin = {};
        await Promise.all(promises).then(vals => {
          vals.forEach((address, idx) => {
            if (address) {
              multicoins[types[idx]].value = multicoins[types[idx]].encode(
                new Buffer(address.replace('0x', ''), 'hex')
              );
            }
          });
        });
        this.multiCoin = multicoins;
      } else {
        this.multicoinSupport = supportsMulticoin;
        this.multiCoin = multicoins;
        this.multiCoin.ETH.value = await this.ens.resolver(this.name).addr();
      }
    } catch (e) {
      this.multicoinSupport = false;
      this.multiCoin = multicoins;
      this.multiCoin.ETH.value = await this.ens.resolver(this.name).addr();
    }
  }
}
