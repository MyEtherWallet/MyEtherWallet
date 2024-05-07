import { defineStore } from 'pinia';

import url from 'url';
import Web3 from 'web3';
import { fromWei, toBN } from 'web3-utils';
import { formatters } from 'web3-core-helpers';

import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { useCustomStore } from '../custom';

import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import MEWProvider from '@/utils/web3-provider';
import EventNames from '@/utils/web3-provider/events';
import { EventBus } from '@/core/plugins/eventBus';

const wallets = {
  state: () => ({
    localStore: false,
    address: null,
    balance: '0',
    blockNumber: 0,
    identifier: '',
    isHardware: false,
    ledgerBLE: false,
    ledgerApp: {},
    instance: null,
    isOfflineApp: false,
    web3: {},
    ensDomains: null,
    tokens: [],
    loadingWalletInfo: true,
    swapRates: []
  }),
  actions: {
    removeWallet() {
      const { setSelectedEIP6963Info, setSelectedEIP6963Provider } =
        useExternalStore();
      if (
        this.identifier === WALLET_TYPES.WALLET_CONNECT ||
        this.identifier === WALLET_TYPES.MEW_WALLET ||
        this.identifier === WALLET_TYPES.WALLET_LINK
      ) {
        const connection = this.instance.getConnection();
        if (connection) {
          if (connection.disconnect) {
            connection.disconnect();
          }
          if (connection.killSession) {
            connection.killSession();
          }
        }
      }
      this.removeWallet();
      setSelectedEIP6963Provider(null);
      setSelectedEIP6963Info(null);
    },
    setWallet(params) {
      const { setSelectedEIP6963Provider } = useExternalStore();
      const wallet = params[0];

      this.instance = wallet;
      this.address = wallet.getAddressString();
      this.isHardware = wallet.hasOwnProperty('isHardware')
        ? wallet.isHardware
        : false;
      this.identifier = wallet.identifier;
      if (!wallet.hasOwnProperty('isHardware')) {
        this.nickname = wallet.getNickname();
      }
      this.setWeb3Instance(params[1]);
      setSelectedEIP6963Provider(params[1]);
    },
    setTokens(params) {
      this.tokens = params;
    },
    setAccountBalance(balance) {
      this.balance = balance;
    },
    setLedgerBluetooth(ledgerBLE) {
      this.ledgerBLE = ledgerBLE;
    },
    setWeb3Instance(provider) {
      const { currentNetwork, Networks, gasPrice, network } = useGlobalStore();
      const hostUrl = currentNetwork.url
        ? url.parse(currentNetwork.url)
        : Networks['ETH'][0];
      const options = {};
      // eslint-disable-next-line
      const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
        currentNetwork.port ? ':' + currentNetwork.port : ''
      }${hostUrl.pathname ? hostUrl.pathname : ''}`;
      currentNetwork.username !== '' && currentNetwork.password !== ''
        ? (options['headers'] = {
            authorization: `Basic: ${btoa(
              currentNetwork.username + ':' + currentNetwork.password
            )}`
          })
        : {};
      const web3Instance = new Web3(
        new MEWProvider(provider ? provider : parsedUrl, options)
      );
      web3Instance.eth.transactionConfirmationBlocks = 1;
      web3Instance['mew'] = {};
      web3Instance['mew'].sendBatchTransactions = arr => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          const nonce = await (arr[0].nonce === undefined
            ? web3Instance.eth.getTransactionCount(this.address)
            : arr[0].nonce);
          for (let i = 0; i < arr.length; i++) {
            const localTx = {
              to: arr[i].to,
              data: arr[i].data,
              from: arr[i].from,
              value: arr[i].value
            };
            const gas = await (arr[i].gas === undefined
              ? web3Instance.eth.estimateGas(localTx)
              : arr[i].gas);
            arr[i].nonce = web3Instance.utils.toBN(nonce).addn(i).toString();
            arr[i].gas = gas;
            arr[i].gasLimit = gas;
            arr[i].chainId = !arr[i].chainId
              ? network.type.chainID
              : arr[i].chainId;
            arr[i].gasPrice =
              arr[i].gasPrice === undefined ? gasPrice : arr[i].gasPrice;
            arr[i] = formatters.inputCallFormatter(arr[i]);
          }
          const batchSignCallback = promises => {
            if (promises instanceof Error) {
              reject(promises);
            }
            if (promises && promises.rejected)
              reject(new Error('User rejected transaction'));
            if (this.identifier === WALLET_TYPES.WEB3_WALLET) {
              Promise.all(promises)
                .then(values => {
                  resolve(values);
                })
                .catch(e => reject(e));
            } else resolve(promises);
          };
          EventBus.$emit(
            EventNames.SHOW_BATCH_TX_MODAL,
            arr,
            batchSignCallback,
            this.isHardware
          );
        });
      };
      this.web3 = web3Instance;
    },
    setOwnedDomains(ownedDomains) {
      this.ensDomains = ownedDomains;
    },
    setLoadingWalletInfo(isLoading) {
      this.loadingWalletInfo = isLoading;
    },
    setBlockNumber(val) {
      this.blockNumber = val;
    },
    setOfflineApp(val) {
      this.isOfflineApp = val;
    },
    setLedgerApp(val) {
      this.ledgerApp = val;
    },
    setSwapRates(val) {
      this.swapRates = val;
    }
  },
  getters: {
    balanceInETH(state) {
      if (!state.balance) state.balance = '0';
      return fromWei(state.balance);
    },

    balanceInWei(state) {
      if (!state.balance) state.balance = '0';
      return state.balance.toString();
    },

    totalOwnedDomains(state) {
      return state.ensDomains ? state.ensDomains.length : 0;
    },

    tokensList(state) {
      const { hiddenTokens } = useCustomStore();
      const tokens = state.tokens;
      return tokens.length > 0
        ? tokens.map(item => {
            if (!item.hasOwnProperty('balance')) {
              item.balance = toBN(0);
            } else {
              item.balance = toBN(item.balance);
            }
            // Check if token is in hiddenTokens
            let isHidden = false;
            if (hiddenTokens.length > 0) {
              isHidden =
                hiddenTokens.find(token => {
                  return item.contract == token.address;
                }) !== undefined;
            }
            item.isHidden = isHidden;
            return item;
          })
        : [];
    },

    hasGasPriceOption(state) {
      return (
        state.identifier === WALLET_TYPES.WEB3_WALLET ||
        state.identifier === WALLET_TYPES.WALLET_CONNECT ||
        state.identifier === WALLET_TYPES.MEW_WALLET ||
        state.identifier === WALLET_TYPES.WALLET_LINK
      );
    }
  }
};

export const useWalletStore = defineStore('wallets', wallets);
