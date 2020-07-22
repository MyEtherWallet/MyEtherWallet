import { getTld, getHostName } from './helpers';
import RegistryAbi from './ABI/registryAbi.js';
import RegistrarControllerAbi from './ABI/registrarControllerAbi.js';
import BaseRegistrarAbi from './ABI/baseRegistrarAbi.js';
import ResolverAbi from './ABI/resolverAbi.js';
import OldEnsAbi from './ABI/oldEnsAbi.js';
import OldDeedAbi from './ABI/oldDeedAbi.js';
import * as nameHashPckg from 'eth-ens-namehash';
import multicoins from './configs/multicoins';
import textrecords from './configs/textrecords';

const OLD_ENS_ADDRESS = '0x6090a6e47849629b7245dfa1ca21d94cd15878ef';
const BURNER_ADDRESS = '0x0000000000000000000000000000000000000000';

const REGISTRAR_INTERFACE = {
  CONTROLLER: '0x018fac06',
  LEGACY: '0x7ba18ba1',
  MULTICOIN: '0xf1cb7e06',
  TEXT_RECORD: '0x59d1d43c'
};

export default class EnsModule {
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
    this.deedValue = 0;
    this.expiration = null;
    this.expired = false;
    this.redeemable = false;
    this.textRecordSupport = false;
    this.multicoinSupport = false;

    // Contracts
    this.registrarContract = null;
    this.registryContract = null;
    this.registrarControllerContract = null;
    this.resolverContract = null;
    this.oldEnsContract = null;
    this.oldDeedContract = null;

    this._initializeNameModule();
  }

  transfer() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }

  setController() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  migrate() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  setMulticoin() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  setTxtRecord() {
    if (this.address === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  register() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  setIPFS() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
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
    try {
      await this._setRegisrar()
        .then(this._setContracts)
        .then(this._setOwner)
        .then(this._setDeeds)
        .then(this._setExpiry)
        .then(this._setMulticoins)
        .then(this._setRecords);
      return {
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
        deedValue: this.deedValue,
        expiration: this.expiration,
        expired: this.expired,
        redeemable: this.redeemable,
        textRecordSupport: this.textRecordSupport,
        multicoinSupport: this.multicoinSupport
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async _setExpiry() {
    const expiryTime = await this.registrarContract.methods
      .nameExpires(this.labelHash)
      .call();
    this.expired = expiryTime * 1000 < new Date().getTime();
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

  async _setContracts() {
    const web3 = this.web3;
    const tld = getTld(this.name);
    const registrarTLD = tld ? tld : this.network.type.ens.registrarTLD;
    this.contractControllerAddress = await this.ens
      .resolver(registrarTLD)
      .interfaceImplementer(REGISTRAR_INTERFACE.CONTROLLER);
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
    this.oldEnsContract = new web3.eth.Contract(OldEnsAbi, OLD_ENS_ADDRESS);
  }

  async _setDeeds() {
    const web3 = this.web3;
    const entries = await this.oldEnsContract.methods
      .entries(this.labelHash)
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

  async _setMulticoins() {
    const supportsTxt = await this.resolverAddress.methods
      .supportsInterface(REGISTRAR_INTERFACE.TEXT_RECORD)
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

  async _setRecords() {
    const supportsMulticoin = await this.resolverAddress.methods
      .supportsInterface(REGISTRAR_INTERFACE.MULTICOIN)
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
  }
}
