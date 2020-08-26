import { getTld, getHostName, decodeCoinAddress } from '../helpers';
import RegistryAbi from '../ABI/registryAbi.js';
import BaseRegistrarAbi from '../ABI/baseRegistrarAbi.js';
import ResolverAbi from '../ABI/resolverAbi.js';
import RegistrarControllerAbi from '../ABI/registrarControllerAbi.js';
import multicoins from '../configs/multicoins';
import textrecords from '../configs/textrecords';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import registrarInterface from './registrarInterface';

export default class NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    this.addressVal = address ? address : '0x';
    this.networkVal = network ? network : null;
    this.web3Val = web3 ? web3 : null;
    this.ensVal = ens ? ens : null;

    // Returned value
    this.nameVal = name ? name : '';
    this.txtRecordsVal = null;
    this.multiCoinVal = null;
    this.labelHashVal = web3.utils.sha3(getHostName(name));
    this.ownerVal = '0x';
    this.registrarAddressVal = '0x';
    this.contractControllerAddressVal = '0x';
    this.resolverAddressVal = '0x';
    this.publicResolverAddressVal = '0x';
    this.contentHashVal = '';
    this.textRecordSupportVal = false;
    this.multicoinSupportVal = false;

    // Contracts
    this.publicResolverContractVal = null;
    this.registrarContractVal = null;
    this.registryContractVal = null;
    this.registrarControllerContractVal = null;
    this.resolverContractVal = null;

    this._initializeNameModule();
  }

  setController(address = '') {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    const actualToAddress = address === '' ? this.account : address;
    const setControllerTx = {
      from: this.account,
      to: this.registrarAddressVal,
      data: this.registrarContractVal.methods
        .reclaim(this.labelHashVal, actualToAddress)
        .encodeABI(),
      value: 0
    };
    return this.web3Val.eth.sendTransaction(setControllerTx);
  }

  migrate() {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    if (this.publicResolverAddressVal === this.resolverAddressVal) {
      throw new 'Name migrated succesfully!'();
    }
    const setResolverTx = {
      from: this.addressVal,
      to: this.networkVal.type.ens.registry,
      data: this.registryContractVal.methods
        .setResolver(this.nameHashVal, this.publicResolverAddressVal)
        .encodeABI(),
      value: 0
    };

    return this.web3Val.sendTransaction(setResolverTx).then(() => {
      return this._migrateCoinsAndRecords();
    });
  }

  setMulticoin(coin) {
    if (this.ownerVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    this.migrate().then(res => {
      if (res.hasOwProperty('success')) return true;

      const arr = coin.map(item => {
        return this.publicResolverContractVal.methods.setAddr(
          this.nameHashVal,
          item.id,
          decodeCoinAddress(item)
        );
      });

      const setAddrTx = {
        from: this.addressVal,
        to: this.publicResolverAddressVal,
        data: this.publicResolverContractVal.methods.multicall(arr).encodeABI(),
        value: 0,
        gas: 100000
      };
      return this.web3Val.eth.sendTransaction(setAddrTx);
    });
  }

  setTxtRecord(obj) {
    if (this.addressVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    for (const _record in obj) {
      this.txtRecordsVal[_record] = obj[_record];
    }
    return this.migrate().then(res => {
      if (res.hasOwProperty('success')) return;
      const multicalls = [];
      for (const i in obj) {
        multicalls.push(
          this.resolverContract.methods
            .setText(this.nameHashVal, i.toLowerCase(), obj[i])
            .encodeABI()
        );
      }
      const tx = {
        from: this.addressVal,
        to: this.publicResolverAddressVal,
        data: this.resolverContract.methods.multicall(multicalls).encodeABI(),
        gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed(),
        value: 0
      };
      return this.web3Val.eth.sendTransaction(tx);
    });
  }

  async _initializeNameModule() {
    if (this.nameVal === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
    if (this.addressVal === '0x') {
      throw new Error('Address not set! Please initialize module properly!');
    }
    if (!this.networkVal) {
      throw new Error('Network not set! Please initialize module properly!');
    }
    if (!this.web3Val) {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    const formValues = {
      address: 'addressVal',
      network: 'networkVal',
      web3: 'web3Val',
      ens: 'ensVal',
      name: 'nameVal',
      txtRecords: 'txtRecordsVal',
      multiCoin: 'multiCoinVal',
      labelHash: 'labelHashVal',
      owner: 'ownerVal',
      registrarAddress: 'registrarAddressVal',
      contractControllerAddress: 'contractControllerAddressVal',
      resolverAddress: 'resolverAddressVal',
      publicResolverAddress: 'publicResolverAddressVal',
      contentHash: 'contentHashVal',
      textRecordSupport: 'textRecordSupportVal',
      multicoinValSupport: 'multicoinSupportVal',
      publicResolverContract: 'publicResolverContractVal',
      registrarContract: 'registrarContractVal',
      registryContract: 'registryContractVal',
      registrarControllerContract: 'registrarControllerContractVal',
      resolverContract: 'resolverContractVal'
    };
    // create a setter and getter methods for all the variables
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
      const promises = await Promise.all([
        this._setRegisrar,
        this._setPublicResolverAddress,
        this._setContracts,
        this._setOwner,
        this._setContentHash,
        this._setMulticoins,
        this._setRecords
      ]);

      return promises;
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setRegisrar() {
    const web3 = this.web3Val;
    const tld = getTld(this.nameVal);
    const registrarTLD = tld ? tld : this.networkVal.type.ens.registrarTLD;
    const registryAddress = this.networkVal.type.ens.registry;
    this.registrarAddressVal = await this.ensVal.owner(registrarTLD);
    this.registryContractVal = new web3.eth.Contract(
      RegistryAbi,
      registryAddress
    );
  }

  async _setOwner() {
    const isSubDomain = this.nameVal.split('.').length > 2;
    try {
      if (!isSubDomain) {
        this.ownerVal = await this.registrarContractVal.methods
          .ownerOf(this.labelHashVal)
          .call();
      } else {
        this.ownerVal = await this.ensVal.owner(this.nameVal);
      }
    } catch (e) {
      this.ownerVal = '0x';
    }
  }

  async _setContentHash() {
    try {
      const hash = await this.resolverContract.methods
        .contenthash(this.nameHashVal)
        .call();
      this.contentHashVal = hash && hash !== '' ? contentHash.decode(hash) : '';
    } catch (e) {
      this.contentHashVal = '';
    }
  }

  async _setPublicResolverAddress() {
    try {
      const resolver = await this.ensVal.resolver('resolver.eth');
      this.publicResolverAddressVal = await resolver.addr();
    } catch (e) {
      this.publicResolverAddressVal = '0x';
    }
  }

  async _setContracts() {
    const web3 = this.web3Val;
    const tld = getTld(this.nameVal);
    const registrarTLD = tld ? tld : this.networkVal.type.ens.registrarTLD;
    this.contractControllerAddressVal = await this.ensVal
      .resolver(registrarTLD)
      .interfaceImplementer(registrarInterface.CONTROLLER);
    this.registrarControllerContractVal = new web3.eth.Contract(
      RegistrarControllerAbi,
      this.controllerContractAddress
    );
    this.registrarContractVal = new web3.eth.Contract(
      BaseRegistrarAbi,
      this.registrarAddressVal
    );
    this.resolverAddressVal = await this.registrarContractVal.methods
      .resolver(this.nameHashVal)
      .call();
    this.resolverContract = new web3.eth.Contract(
      ResolverAbi,
      this.resolverAddressVal
    );
    this.publicResolverContractVal = new web3.eth.Contract(
      ResolverAbi,
      this.publicResolverAddressVal
    );
  }

  async _setMulticoins() {
    const supportsTxt = await this.resolverAddressVal.methods
      .supportsInterface(registrarInterface.TEXT_RECORD)
      .call();
    if (supportsTxt) {
      this.textRecordSupportVal = supportsTxt;
      this.txtRecordsVal = {};
      const promises = [];
      textrecords.forEach(txt => {
        promises.push(
          this.resolverContract.methods.text(this.nameHashVal, txt.name).call()
        );
      });
      Promise.all(promises).then(vals => {
        vals.forEach((val, idx) => {
          this.txtRecordsVal[textrecords[idx].name] = val;
        });
      });
    } else {
      this.textRecordSupportVal = supportsTxt;
      this.txtRecordsVal = null;
    }
  }

  async _migrateCoinsAndRecords() {
    const multicallRecords = [];
    try {
      for (const coin in multicoins) {
        if (multicoins[coin].value) {
          multicallRecords.push(
            this.publicResolverContractVal.methods
              .setAddr(
                this.nameHashVal,
                multicoins[coin].id,
                decodeCoinAddress(multicoins[coin])
              )
              .encodeABI()
          );
        }
      }

      for (const txt in this.txtRecordsVal) {
        if (this.txtRecordsVal[txt]) {
          multicallRecords.push(
            this.resolverContract.methods
              .setText(this.nameHashVal, txt, this.txtRecordsVal[txt])
              .encodeABI()
          );
        }
      }

      const txObj = {
        from: this.addressVal,
        to: this.publicResolverAddressVal,
        data: this.publicResolverContractVal.methods
          .multicall(multicallRecords)
          .encodeABI(),
        value: 0
      };

      return this.web3Val.sendTransaction(txObj);
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setRecords() {
    try {
      const supportsMulticoin = await this.resolverAddressVal.methods
        .supportsInterface(registrarInterface.MULTICOIN)
        .call();

      for (const type in multicoins) {
        multicoins[type].value = '';
      }

      if (supportsMulticoin) {
        const types = Object.keys(multicoins);
        const promises = types.map(type => {
          return this.ensVal
            .resolver(this.nameVal, ResolverAbi)
            .addr(multicoins[type].id);
        });
        this.multicoinSupportVal = supportsMulticoin;
        this.multiCoinVal = {};
        await Promise.all(promises).then(vals => {
          vals.forEach((address, idx) => {
            if (address) {
              multicoins[types[idx]].value = multicoins[types[idx]].encode(
                new Buffer(address.replace('0x', ''), 'hex')
              );
            }
          });
        });
        this.multiCoinVal = multicoins;
      } else {
        this.multicoinSupportVal = supportsMulticoin;
        this.multiCoinVal = multicoins;
        this.multiCoinVal.ETH.value = await this.ensVal
          .resolver(this.nameVal)
          .addr();
      }
    } catch (e) {
      this.multicoinSupportVal = false;
      this.multiCoinVal = multicoins;
      this.multiCoinVal.ETH.value = await this.ensVal
        .resolver(this.nameVal)
        .addr();
    }
  }
}
