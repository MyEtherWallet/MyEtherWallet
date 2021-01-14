import { getTld, getHostName, decodeCoinAddress } from './helpers';
import RegistryAbi from './ABI/registryAbi.js';
import BaseRegistrarAbi from './ABI/baseRegistrarAbi.js';
import ResolverAbi from './ABI/resolverAbi.js';
import FifsRegistrarAbi from './ABI/fifsRegistrarAbi.js';
import RegistrarControllerAbi from './ABI/registrarControllerAbi.js';
import multicoins from './manage/configs/multicoins';
import textrecords from './manage/configs/textrecords';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import registrarInterface from './manage/registrarInterface';
import * as nameHashPckg from 'eth-ens-namehash';
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
    this.name = name ? name : '';
    this.nameHash = nameHashPckg.hash(name);
    this.txtRecords = null;
    this.multiCoin = null;
    this.labelHash = web3.utils.sha3(getHostName(name));
    this.owner = '0x';
    this.registrarAddress = '0x';
    this.contractControllerAddress = '0x';
    this.resolverAddress = '0x';
    this.publicResolverAddress = '0x';
    this.contentHash = '';
    this.textRecordSupport = false;
    this.multicoinSupport = false;

    // Contracts
    this.publicResolverContract = null;
    this.registrarContract = null;
    this.registryContract = null;
    this.registrarControllerContract = null;
    this.resolverContract = null;

    this._initializeNameModule();
  }

  setController(address = '') {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    const actualToAddress = address === '' ? this.account : address;
    const setControllerTx = {
      from: this.account,
      to: this.registrarAddress,
      data: this.registrarContract.methods
        .reclaim(this.labelHash, actualToAddress)
        .encodeABI(),
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

  async _initializeNameModule() {
    if (this.name === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    if (this.address === '0x') {
      throw new Error('Address not set! Please initialize module properly!');
    }
    if (!this.network) {
      throw new Error('Network not set! Please initialize module properly!');
    }
    if (!this.web3) {
      throw new Error('Owner not set! Please initialize module properly!');
    }

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
      resolverContract: 'resolverContract'
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
      return this._setRegistar();
    } catch (e) {
      console.error('ens maanger init', e);
      throw new Error(e);
    }
  }

  async _setRegistar() {
    const web3 = this.web3;
    const tld = getTld(this.name);
    const registrarTLD = tld ? tld : this.network.type.ens.registrarTLD;
    const registryAddress = this.network.type.ens.registry;
    this.registrarAddress = await this.ens.owner(registrarTLD);
    this.registryContract = new web3.eth.Contract(RegistryAbi, registryAddress);
    this._setPublicResolverAddress();
  }

  async _setOwner() {
    const isSubDomain = this.name.split('.').length > 2;
    try {
      if (!isSubDomain) {
        this.owner = await this.registrarContract.methods
          .ownerOf(this.labelHash)
          .call();
      } else {
        this.owner = await this.ens.owner(this.name);
      }
    } catch (e) {
      this.owner = '0x';
    }
    this._setContentHash();
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
    this._setMulticoins();
  }

  async _setPublicResolverAddress() {
    try {
      const resolver = await this.ens.resolver('resolver.eth');
      this.publicResolverAddress = await resolver.addr();
    } catch (e) {
      this.publicResolverAddress = '0x';
    }
    this._setContracts();
  }

  async _setContracts() {
    const web3 = this.web3;
    const tld = getTld(this.name);
    const registrarTLD = tld ? tld : this.network.type.ens.registrarTLD;
    const abi =
      this.network.type.ens.registrarType === REGISTRAR_TYPES.FIFS
        ? FifsRegistrarAbi
        : BaseRegistrarAbi;
    this.name = !tld ? this.name + '.' + tld : this.name;
    this.registrarContract = new web3.eth.Contract(abi, this.registrarAddress);
    if (this.network.type.ens.registrarType === REGISTRAR_TYPES.PERMANENT) {
      try {
        this.contractControllerAddress = await this.ens
          .resolver(registrarTLD, ResolverAbi)
          .interfaceImplementer(registrarInterface.CONTROLLER);
        this.registrarControllerContract = new web3.eth.Contract(
          RegistrarControllerAbi,
          this.contractControllerAddress
        );
      } catch (e) {
        console.error('set Contracts', e);
      }
    }
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
    this._setOwner();
  }

  async _setMulticoins() {
    const supportsTxt = await this.resolverContract.methods
      .supportsInterface(registrarInterface.TEXT_RECORD)
      .call();
    if (supportsTxt) {
      this.textRecordSupport = supportsTxt;
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
    } else {
      this.textRecordSupport = supportsTxt;
      this.txtRecords = null;
    }
    this._setRecords();
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
