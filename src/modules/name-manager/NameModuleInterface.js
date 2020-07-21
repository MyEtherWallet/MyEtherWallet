export default class NameModuleInterface {
  constructor(name, address, network, web3) {
    this.name = name ? name : '';
    this.address = address ? address : '0x';
    this.network = network ? network : null;
    this.web3 = web3 ? web3 : null;
    this.txtRecords = null;
    this.multiCoin = null;
    this.avatar = '';
    this.owner = '0x';
    this.registrarAddress = '0x';
    this.registrarControllerAddress = '0x';
    this.registrarContract = null;
    this.registryContract = null;
    this.registrarControllerContract = null;
    this.oldEnsContract = null;
    this.oldDeedContract = null;
    this.redeemable = false;

    this._initializeNameModule();
  }

  transferDomain() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }

  setController() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  resolverMigrateAndSet() {
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
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  registerDomain() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }
  setIPFS() {
    if (this.owner === '0x') {
      throw new Error('Owner not set! Please initialize module properly!');
    }
  }

  _initializeNameModule() {
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
  }
}
