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

export default class makerOps {
  constructor(maker, web3, account) {
    console.log(schema); // todo remove dev item
    this.web3 = web3;
    this.account = account;
    this.maker = maker;
    this.network = 'KOV';
    this.objects = {};
    this.stopIntervals = false;
    this.interval = null;

    console.log(account.address); // todo remove dev item
    this.filtersReceived = {};

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

  calculateLiquidationPrice(par, per, mat, skr, dai) {
    return wdiv(wmul(wmul(dai, par), mat), wmul(skr, per));
  }

  calculateRatio(tag, par, skr, dai) {
    return wdiv(wmul(skr, tag).round(0), wmul(dai, par));
  }

  tab(cup, chi) {
    return wmul(cup.art, chi).round(0);
  }

  rap(cup, rhi, chi) {
    return wmul(cup.ire, rhi)
      .minus(this.tab(cup, chi))
      .round(0);
  }

  calculateLiquidationPrice2(skr, dai) {
    return this.calculateLiquidationPrice(
      this.vox.par,
      this.tub.per,
      this.tub.mat,
      skr,
      dai
    );
  }

  calculateRatio = (skr, dai) => {
    return this.calculateRatio(this.tub.tag, this.vox.par, skr, dai);
  };

  setProxy(proxy) {
    this.proxy =
      proxy !== '0x0000000000000000000000000000000000000000' ? proxy : null;
    this.loadObject('dsproxy', this.proxy, 'proxy');
    console.debug('Found proxy:', this.proxy);
  }

  loadObject(type, address, label = null) {
    const object = new this.web3.eth.Contract(schema[type].abi, address);
    if (label) {
      this.objects[label] = object;
    }
    return object;
  }

  getContracts(proxyRegistry, address) {
    return new Promise((resolve, reject) => {
      console.log(this.objects.saiValuesAggregator); // todo remove dev item
      this.objects.saiValuesAggregator.getContractsAddrs(
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

  loadContracts() {
    if (this.network && !this.network.stopIntervals) {
      // blockchain.resetFilters(true);
      if (typeof this.interval !== 'undefined') clearInterval(this.interval);
      // this.dialog.reset();
      // this.system.reset();
      // this.transactions.reset();

      // Check actual block number from 3 different requests (workaround to try to avoid outdated nodes behind load balancer)
      const blockPromises = [];
      for (let i = 0; i < 3; i++) {
        blockPromises.push(this.web3.eth.getBlockNumber());
      }

      Promise.all(blockPromises).then(r => {
        r.forEach(block => this.transactions.setLatestBlock(block)); // Will set the maximum value

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
      });
    }
  }

  _loadContracts() {
    this.getContracts(
      settings.chain[this.network].proxyRegistry,
      this.account.address,
    ).then(
      r => {
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
            // this.transactions.setLatestBlock(block);
            // Set profile proxy and system contracts
            this.profile.setProxy(r[2]);
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
            // this.network.stopLoadingAddress();
            // this.transactions.setStandardGasPrice();

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
      },
      () => {
        console.debug('Error loading contracts, trying again...');
        setTimeout(this._loadContracts, 2000);
      }
    );
  }

  setVariablesInterval = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        console.debug('Running variables interval');
        // this.transactions.setStandardGasPrice();
        // this.transactions.checkPendingTransactions();
      }, 10000);
    }

    if (!this.intervalAggregatedValues) {
      this.intervalAggregatedValues = setInterval(() => {
        console.debug('Running setAggregatedValues interval');
        this.system.setAggregatedValues();
      }, 5000);
    }
  };

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

  getAggregatedValues(account, proxy) {
    return new Promise((resolve, reject) => {
      this.objects.saiValuesAggregator.aggregateValues.call(
        account,
        proxy,
        { from: '0x0000000000000000000000000000000000000000' },
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

  setLatestBlock(block, flexible = false) {
    if (block >= this.transactions.latestBlock) {
      this.transactions.amountCheck = 0;
      console.debug(`Latest Block: ${block}`);
      this.transactions.latestBlock = block;
      return true;
    } else if (flexible && block + 5 >= this.transactions.latestBlock) {
      return true;
    }
    return false;
  }

  fromRaytoWad(x) {
    const y = toBigNumber(x).div(toBigNumber(10).pow(9));
    return y;
  }

  setAggregatedValues(callbacks = [], firstLoad = false, ignoreMutex = false) {
    if (callbacks.length === 0 && ignoreMutex === false) {
      if (this.setAggregatedValuesMutexLocked) {
        console.debug('Skipping aggregated values lookup (mutex locked)');
        return;
      }
      this.setAggregatedValuesMutexLocked = true;
    }

    console.debug('Getting aggregated values...');
    const sValues = [
      ['tub', 'axe', true],
      ['tub', 'mat', true],
      ['tub', 'cap'],
      ['tub', 'fit'],
      ['tub', 'tax', true],
      ['tub', 'fee', true],
      ['tub', 'chi', true],
      ['tub', 'rhi', true],
      ['tub', 'rho'],
      ['tub', 'gap'],
      ['tub', 'tag', true],
      ['tub', 'per', true],
      ['vox', 'par', true],
      ['vox', 'way', true],
      ['vox', 'era'],
      ['tap', 'fix', true],
      ['tap', 'gap']
    ];

    const tValues = [
      ['eth', 'myBalance'],
      ['gem', 'totalSupply'],
      ['gem', 'myBalance'],
      ['gem', 'tubBalance'],
      ['gem', 'tapBalance'],
      ['gov', 'totalSupply'],
      ['gov', 'myBalance'],
      ['gov', 'pitBalance'],
      ['gov', 'allowance'],
      ['skr', 'totalSupply'],
      ['skr', 'myBalance'],
      ['skr', 'tubBalance'],
      ['skr', 'tapBalance'],
      ['dai', 'totalSupply'],
      ['dai', 'myBalance'],
      ['dai', 'tapBalance'],
      ['dai', 'allowance'],
      ['sin', 'totalSupply'],
      ['sin', 'tubBalance'],
      ['sin', 'tapBalance']
    ];

    this.getAggregatedValues(
      this.account.address,
      this.profile.proxy
    ).then(r => {
      // console.debug("Got aggregateValues() result:", r);
      const block = r[0].toNumber();
      if (this.transactions.setLatestBlock(block, firstLoad)) {
        // Set pip and pep
        this.pip.val = toBigNumber(r[2] ? parseInt(r[1], 16) : -1);
        this.pep.val = toBigNumber(r[4] ? parseInt(r[3], 16) : -1);
        // Set off, out, eek and safe
        this.tub.off = r[5][0];
        this.tub.out = r[5][1];
        this.tub.eek = r[5][2];
        this.tub.safe = r[5][3];
        // Set system values
        for (const [index, val] of sValues.entries()) {
          this[val[0]][val[1]] =
            val[2] || false ? this.fromRaytoWad(r[6][index]) : r[6][index];
        }
        // Set token values
        for (const [index, val] of tValues.entries()) {
          // Immediately detect updated allowance change
          if (
            val[1] === 'allowance' &&
            this.transactions.loading.hasOwnProperty('changeAllowance') &&
            !this[val[0]][val[1]].eq(r[7][index])
          ) {
            console.debug('Detected allowance change for:', val[0]);
            setTimeout(
              () => this.transactions.cleanLoading('changeAllowance', val[0]),
              100
            );
          }
          this[val[0]][val[1]] = r[7][index];
        }

        // Unlock mutex
        if (callbacks.length === 0) this.setAggregatedValuesMutexLocked = false;
        // Execute possible callbacks
        else this.transactions.executeCallbacks(callbacks);
      } else {
        console.debug(
          `Ignoring returned values (latest block #${
            this.transactions.latestBlock
          }, response block #${block}). Trying again...`
        );
        setTimeout(
          () => this.setAggregatedValues(callbacks, firstLoad, true),
          1000
        );
      }
    });
  }

  executeCallbacks(callbacks) {
    callbacks && callbacks.forEach(callback => this.executeCallback(callback));
  }

  getProviderUseLogs() {
    return this.web3.useLogs;
  }

  executeCallback(args) {
    let method = args.shift();
    // Edge case: Skip executing this here so it's only called after an error (via lookForCleanCallBack)
    if (method === 'transactions/cleanLoadingOnError') return;
    // If the callback is to execute a getter function is better to wait as sometimes the new value is not uopdated instantly when the tx is confirmed
    const timeout =
      [
        'transactions/cleanLoading',
        'system/changeAllowance',
        'system/checkAllowance',
        'system/lockAndDraw',
        'system/wipeAndFree',
        'system/lock',
        'system/draw',
        'system/wipe',
        'system/free',
        'system/shut',
        'system/give',
        'system/migrateCDP',
        'system/moveLegacyCDP'
      ].indexOf(method) !== -1
        ? 0
        : 5000;
    setTimeout(() => {
      method = method.split('/');
      console.debug('executeCallback', `${method[0]}.${method[1]}`, args);
      if (method[0] === 'transactions') {
        this[method[1]](...args);
      } else {
        let object = null;
        switch (method[0]) {
          case 'system':
            object = this.system;
            break;
          case 'profile':
            object = this.profile;
            break;
          default:
            break;
        }
        object && object[method[1]](...args);
      }
    }, timeout);
  }
}
