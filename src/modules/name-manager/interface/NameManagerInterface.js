import { getTld, getHostName, decodeCoinAddress } from '../helpers';
import RegistryAbi from '../ABI/registryAbi.js';
import RegistrarControllerAbi from '../ABI/registrarControllerAbi.js';
import BaseRegistrarAbi from '../ABI/baseRegistrarAbi.js';
import ResolverAbi from '../ABI/resolverAbi.js';
import * as nameHashPckg from 'eth-ens-namehash';
import multicoins from '../configs/multicoins';
import textrecords from '../configs/textrecords';
import contentHash from 'content-hash';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import registrarInterface from './registrarInterface';

export default class NameManagerInterface {
  constructor(name, address, network, web3, ens) {
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.ens = ens ? ens : null;

    // Returned value
    this.name = name ? name : '';
    this.txtRecords = null;
    this.multiCoin = null;
    this.labelHash = web3.utils.sha3(getHostName(name));
    this.nameHash = nameHashPckg.hash(name);
    this.owner = '0x';
    this.registrarAddress = '0x';
    this.contractControllerAddress = '0x';
    this.resolverAddress = '0x';
    this.deedOwner = '0x';
    this.publicResolverAddress = '0x';
    this.contentHash = '';
    this.deedValue = 0;
    this.expiration = null;
    this.expired = false;
    this.redeemable = false;
    this.textRecordSupport = false;
    this.multicoinSupport = false;
    this.moduleData = {};

    // not sure if needs to return
    this.secretPhrase = '';

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
    return new Promise((resolve, reject) => {
      const actualToAddress = address === '' ? this.account : address;
      const setControllerTx = {
        from: this.account,
        to: this.registrarAddress,
        data: this.registrarContract.methods
          .reclaim(this.labelHash, actualToAddress)
          .encodeABI(),
        value: 0
      };
      return this.web3.eth
        .sendTransaction(setControllerTx)
        .then(() => {
          resolve({ success: 'Domain Controller set successfully' });
        })
        .catch(reject);
    });
  }

  migrate() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    return new Promise((resolve, reject) => {
      if (this.publicResolverAddress === this.resolverAddress) {
        return resolve({ success: 'Name migrated succesfully!' });
      }
      const setResolverTx = {
        from: this.address,
        to: this.network.type.ens.registry,
        data: this.registryContract.methods
          .setResolver(this.nameHash, this.publicResolverAddress)
          .encodeABI(),
        value: 0
      };

      this.web3
        .sendTransaction(setResolverTx)
        .then(() => {
          this._migrateCoinsAndRecords()
            .then(() => {
              return resolve({
                success: 'Name migrated successfully!'
              });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  setMulticoin(coin) {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    return new Promise((resolve, reject) => {
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
        this.web3.eth
          .sendTransaction(setAddrTx)
          .then(() => {
            this.setModuleData();
            return resolve({
              success: 'Succesfully set multicoin!'
            });
          })
          .catch(reject);
      });
    });
  }

  setTxtRecord(obj) {
    if (this.address === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }

    return new Promise((resolve, reject) => {
      for (const _record in obj) {
        this.txtRecords[_record] = obj[_record];
      }
      this.migrate().then(res => {
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
          gasPrice: new BigNumber(unit.toWei(this.gasPrice, 'gwei')).toFixed(),
          value: 0
        };
        this.web3.eth
          .sendTransaction(tx)
          .then(() => {
            this.setModuleData();
            return resolve({
              success: 'Succesfully set text records!'
            });
          })
          .catch(reject);
      });
    });
  }

  setModuleData() {
    this.moduleData = {
      name: this.name,
      txtRecords: this.txtRecords,
      multiCoin: this.multiCoin,
      labelHash: this.labelHash,
      nameHash: this.nameHash,
      owner: this.owner,
      registrarAddress: this.registrarAddress,
      contractControllerAddress: this.contractControllerAddress,
      resolverAddress: this.resolverAddress,
      publicResolverAddress: this.publicResolverAddress,
      deedOwner: this.deedOwner,
      deedValue: this.deedValue,
      expiration: this.expiration,
      expired: this.expired,
      redeemable: this.redeemable,
      textRecordSupport: this.textRecordSupport,
      multicoinSupport: this.multicoinSupport
    };
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

    const formValues = {
      address: this.address,
      network: this.network,
      web3: this.web3,
      ens: this.ens,
      name: this.name,
      txtRecords: this.txtRecords,
      multiCoin: this.multiCoin,
      labelHash: this.labelHash,
      nameHash: this.nameHash,
      owner: this.owner,
      registrarAddress: this.registrarAddress,
      contractControllerAddress: this.contractControllerAddress,
      resolverAddress: this.resolverAddress,
      deedOwner: this.deedOwner,
      publicResolverAddress: this.publicResolverAddress,
      contentHash: this.contentHash,
      deedValue: this.deedValue,
      expiration: this.expiration,
      expired: this.expired,
      redeemable: this.redeemable,
      textRecordSupport: this.textRecordSupport,
      multicoinSupport: this.multicoinSupport,
      secretPhrase: this.secretPhrase,
      publicResolverContract: this.publicResolverContract,
      registrarContract: this.registrarContract,
      registryContract: this.registryContract,
      registrarControllerContract: this.registrarControllerContract,
      resolverContract: this.resolverContract
    };
    // create a setter and getter methods for all the variables
    Object.keys(formValues).forEach(propName => {
      Object.defineProperties(this, propName, {
        enumerable: true,
        get: () => {
          return this[propName];
        },
        set: value => {
          this[propName] = value;
        }
      });
    });

    try {
      await this._setRegisrar()
        .then(this._setPublicResolverAddress)
        .then(this._setContracts)
        .then(this._setOwner)
        .then(this._setContentHash)
        .then(this._setMulticoins)
        .then(this._setRecords)
        .then(this.setModuleData);
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setRegisrar() {
    const web3 = this.web3;
    const tld = getTld(this.name);
    const registrarTLD = tld ? tld : this.network.type.ens.registrarTLD;
    const registryAddress = this.network.type.ens.registry;
    this.registrarAddress = await this.ens.owner(registrarTLD);
    this.registryContract = new web3.eth.Contract(RegistryAbi, registryAddress);
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

  async _setPublicResolverAddress() {
    try {
      const resolver = await this.ens.resolver('resolver.eth');
      this.publicResolverAddress = await resolver.addr();
    } catch (e) {
      this.publicResolverAddress = '0x';
    }
  }

  async _setContracts() {
    const web3 = this.web3;
    const tld = getTld(this.name);
    const registrarTLD = tld ? tld : this.network.type.ens.registrarTLD;
    this.contractControllerAddress = await this.ens
      .resolver(registrarTLD)
      .interfaceImplementer(registrarInterface.CONTROLLER);
    this.registrarControllerContract = new web3.eth.Contract(
      RegistrarControllerAbi,
      this.controllerContractAddress
    );
    this.registrarContract = new web3.eth.Contract(
      BaseRegistrarAbi,
      this.registrarAddress
    );
    this.resolverAddress = await this.registrarContract.methods
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
  }

  async _setMulticoins() {
    const supportsTxt = await this.resolverAddress.methods
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
      const supportsMulticoin = await this.resolverAddress.methods
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
