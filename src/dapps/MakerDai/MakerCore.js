/* eslint-disable */
// using http preset and kovan.infura.io results in error: "Failed to subscribe
// to new newBlockHeaders to confirm the transaction receipts", because HTTP
// provider doesn't support subscriptions.
// const KOVAN_INFURA_URL = 'https://kovan.infura.io';
// import * as unit from 'ethjs-unit';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import schema from './abis';

import { MIN_DEPOSIT, settings } from './config';
import { Misc } from '@/helpers';

const toBigNumber = num => {
  return new BigNumber(num);
};
const WAD = new BigNumber(utils.toWei('1'));

// Multiply WAD values
const wmul = (a, b) => {
  return new BigNumber(a).times(b).div(WAD);
};

//Divide WAD values
const wdiv = (a, b) => {
  return new BigNumber(a).times(WAD).div(b);
};

export default class MakerCore {
  constructor(maker, web3, account, blockNumber) {
    console.log(blockNumber); // todo remove dev item
    console.log(schema); // todo remove dev item
    this.web3 = web3;
    this.account = account;
    this.maker = maker;
    this.network = 'KOV';
    this.objects = {};
    this.blockNumber = blockNumber;
    this.stopIntervals = false;
    this.interval = null;
    console.log(settings); // todo remove dev item
    console.log(account.address); // todo remove dev item
    this.filtersReceived = {};

    this.contractAddresses = {
      proxyRegistry: settings.chain[this.network].proxyRegistry,
      saiValuesAggregator: settings.chain[this.network].saiValuesAggregator
    };

    this.transactions = {
      latestBlock: 0,
      amountCheck: 0,
      registry: {},
      loading: {},
      cleanLoading: {},
      setLatestBlock(block) {
        this.latestBlock = block;
      }
    };

    this.system = {};

    this.profile = {
      proxy: ''
    };
    this.tub = {
      address: null,
      authority: null,
      eek: 'undefined',
      safe: 'undefined',
      off: -1,
      out: -1,
      axe: toBigNumber(-1),
      mat: toBigNumber(-1),
      cap: toBigNumber(-1),
      fit: toBigNumber(-1),
      tax: toBigNumber(-1),
      fee: toBigNumber(-1),
      chi: toBigNumber(-1),
      rhi: toBigNumber(-1),
      rho: toBigNumber(-1),
      gap: toBigNumber(-1),
      tag: toBigNumber(-1),
      per: toBigNumber(-1),
      avail_boom_skr: toBigNumber(-1),
      avail_boom_dai: toBigNumber(-1),
      avail_bust_skr: toBigNumber(-1),
      avail_bust_dai: toBigNumber(-1),
      cups: {},
      cupId: null,
      cupsLoading: true,
      cupsCount: 0,
      cupsPage: 1,
      legacyCups: {}
    };
    this.top = {
      address: null
    };
    this.tap = {
      address: null,
      fix: toBigNumber(-1),
      gap: toBigNumber(-1)
    };
    this.vox = {
      address: null,
      era: toBigNumber(-1),
      tau: toBigNumber(-1),
      par: toBigNumber(-1),
      way: toBigNumber(-1)
    };
    this.pit = {
      address: null
    };
    this.eth = {
      myBalance: toBigNumber(-1)
    };
    this.gem = {
      address: null,
      totalSupply: toBigNumber(-1),
      myBalance: toBigNumber(-1),
      tubBalance: toBigNumber(-1),
      tapBalance: toBigNumber(-1)
    };
    this.gov = {
      address: null,
      totalSupply: toBigNumber(-1),
      myBalance: toBigNumber(-1),
      pitBalance: toBigNumber(-1),
      allowance: toBigNumber(-1)
    };
    this.skr = {
      address: null,
      totalSupply: toBigNumber(-1),
      myBalance: toBigNumber(-1),
      tubBalance: toBigNumber(-1),
      tapBalance: toBigNumber(-1)
    };
    this.dai = {
      address: null,
      totalSupply: toBigNumber(-1),
      myBalance: toBigNumber(-1),
      tapBalance: toBigNumber(-1),
      allowance: toBigNumber(-1)
    };
    this.sin = {
      address: null,
      totalSupply: toBigNumber(-1),
      tubBalance: toBigNumber(-1),
      tapBalance: toBigNumber(-1)
    };
    this.pip = {
      address: null,
      val: toBigNumber(-1)
    };
    this.pep = {
      address: null,
      val: toBigNumber(-1)
    };
    this.setAggregatedValuesMutexLocked = false;
    this.loadContracts();
  }

  loadObject(type, address, label = null) {
    const object = new this.web3.eth.Contract(schema[type].abi, address);
    if (label) {
      console.log('label'); // todo remove dev item
      this.objects[label] = object;
    }
    console.log('no label'); // todo remove dev item
    return object;
  }

  loadContracts() {
    this.loadObject(
      'proxyregistry',
      settings.chain[this.network].proxyRegistry,
      'proxyRegistry'
    );
    this.loadObject(
      'saivaluesaggregator',
      settings.chain[this.network].saiValuesAggregator,
      'saiValuesAggregator'
    );

    this._loadContracts();
  }

  getContracts(proxyRegistry, address) {
    console.log('proxyRegistry', proxyRegistry); // todo remove dev item
    return new Promise((resolve, reject) => {
      console.log('saiValuesAggregator', this.objects.saiValuesAggregator); // todo remove dev item

      /*
      *       "name": "getContractsAddrs",
      "outputs": [
        {
          "name": "blockNumber",
          "type": "uint256"
        },
        {
          "name": "saiContracts",
          "type": "address[]"
        },
        {
          "name": "proxy",
          "type": "address"
        }
      ],
      */
      console.log(
        'getContractsAddrs',
        this.objects.saiValuesAggregator.methods.getContractsAddrs
      ); // todo remove dev item
      this.objects.saiValuesAggregator.methods.getContractsAddrs(
        this.blockNumber,
        proxyRegistry,
        address,
        (e, r) => {
          if (!e) {
            resolve(r);
          } else {
            reject(e);
          }
        }
      );
    });
  }

  setVariablesInterval() {
    // placeholder
  }

  setProxy(proxy) {
    this.proxy =
      proxy !== '0x0000000000000000000000000000000000000000' ? proxy : null;
    this.loadObject('dsproxy', this.proxy, 'proxy');
    console.debug('Found proxy:', this.proxy);
  }

  _loadContracts() {
    this.getContracts(this.contractAddresses.proxyRegistry, this.account.address)
      .then(r => {
        console.log(r); // todo remove dev item
        return r;
      })
      .then(r => {
        if (
          r &&
          r[0] &&
          r[1] &&
          Misc.isValidETHAddress(r[1][0]) &&
          Misc.isValidETHAddress(r[1][1])
        ) {
          const block = r[0].toNumber();
          // Make the contracts addresses load a bit more flexible, just checking the node request is bringing data no older than 5 blocks
          if (block > this.transactions.latestBlock - 5) {
            // Set profile proxy and system contracts
            this.setProxy(r[2]);
            this.init(
              r[1][0],
              r[1][1],
              r[1][2],
              r[1][3],
              r[1][4],
              r[1][5],
              r[1][6],
              r[1][7],
              r[1][8],
              r[1][9],
              r[1][10],
              r[1][11]
            );

            this.setVariablesInterval();
          } else {
            console.debug(
              `Error loading contracts (latest block ${
                this.transactions.latestBlock
              }, request one: ${block}, trying again...`
            );
            // this.transactions.addAmountCheck();
            setTimeout(this._loadContracts, 2000);
          }
        } else {
          console.debug('Error loading contracts, trying again...');
          // this.transactions.addAmountCheck();
          setTimeout(this._loadContracts, 2000);
        }
      })
      .catch(err => {
        console.log(err); // todo remove dev item
        console.debug('Error loading contracts, trying again...');
        setTimeout(this._loadContracts, 2000);
      });
  }

  init(top, tub, tap, vox, pit, pip, pep, gem, gov, skr, dai, sin) {
    if (this.network && !this.stopIntervals) {
      this.top.address = top;
      this.loadObject('top', top, 'top');

      this.tub.address = tub;
      this.loadObject('tub', tub, 'tub');
      // this.setFiltersTub();

      this.tap.address = tap;
      this.loadObject('tap', tap, 'tap');
      // this.setFiltersTap();

      this.vox.address = vox;
      this.loadObject('vox', vox, 'vox');
      // this.setFiltersVox();

      this.pit.address = pit;

      this.pip.address = pip;
      this.loadObject('dsvalue', pip, 'pip');
      // this.setFiltersFeedValue('pip');

      this.pep.address = pep;
      this.loadObject('dsvalue', pep, 'pep');
      // this.setFiltersFeedValue('pep');

      this.gem.address = gem;
      this.loadObject('dsethtoken', gem, 'gem');
      // this.setFiltersToken('gem');

      this.gov.address = gov;
      this.loadObject('dstoken', gov, 'gov');
      // this.setFiltersToken('gov');

      this.skr.address = skr;
      this.loadObject('dstoken', skr, 'skr');
      // this.setFiltersToken('skr');

      this.dai.address = dai;
      this.loadObject('dstoken', dai, 'dai');
      // this.setFiltersToken('dai');

      this.sin.address = sin;
      this.loadObject('dstoken', sin, 'sin');
      // this.setFiltersToken('sin');

      this.setAggregatedValues([], true);

      // this.setMyCupsFromChain(false, [], true);
      // this.setMyLegacyCupsFromChain([], true);
    }
  }
}
