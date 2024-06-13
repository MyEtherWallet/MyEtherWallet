import { ref, computed } from 'vue';
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

export const useWalletStore = defineStore('wallets', () => {
  const localStore = false;
  const address = ref(null);
  const balance = ref('0');
  const blockNumber = ref(0);
  const identifier = ref('');
  const nickname = ref('');
  const isHardware = ref(false);
  const ledgerBLE = ref(false);
  const ledgerApp = ref({});
  const instance = ref(null);
  const isOfflineApp = ref(false);
  const web3 = ref({});
  const ensDomains = ref(null);
  const tokens = ref([]);
  const loadingWalletInfo = ref(true);
  const swapRates = ref([]);

  // getters
  const balanceInETH = computed(() => {
    if (!balance.value) balance.value = '0';
    return fromWei(balance.value);
  });

  const balanceInWei = computed(() => {
    if (!balance.value) balance.value = '0';
    return balance.value.toString();
  });

  const totalOwnedDomains = computed(() => {
    return ensDomains.value ? ensDomains.value.length : 0;
  });

  const tokensList = computed(() => {
    const { hiddenTokens } = useCustomStore();
    return tokens.value.length > 0
      ? tokens.value.map(item => {
          if (!item.hasOwnProperty('balance')) {
            item.balance = toBN(0);
          } else {
            item.balance = toBN(item.balance);
          }
          // Check if token is in hiddenTokens
          let isHidden = false;
          if (hiddenTokens.value.length > 0) {
            isHidden =
              hiddenTokens.value.find(token => {
                return item.contract == token.address;
              }) !== undefined;
          }
          item.isHidden = isHidden;
          return item;
        })
      : [];
  });

  const hasGasPriceOption = computed(() => {
    return (
      identifier.value === WALLET_TYPES.WEB3_WALLET ||
      identifier.value === WALLET_TYPES.WALLET_CONNECT ||
      identifier.value === WALLET_TYPES.MEW_WALLET ||
      identifier.value === WALLET_TYPES.WALLET_LINK
    );
  });

  // actions
  const removeWallet = () => {
    const { setSelectedEIP6963Info, setSelectedEIP6963Provider } =
      useExternalStore();
    if (
      identifier.value === WALLET_TYPES.WALLET_CONNECT ||
      identifier.value === WALLET_TYPES.MEW_WALLET ||
      identifier.value === WALLET_TYPES.WALLET_LINK
    ) {
      const connection = instance.value.getConnection();
      if (connection) {
        if (connection.disconnect) {
          connection.disconnect();
        }
        if (connection.killSession) {
          connection.killSession();
        }
      }
    }
    removeWallet();
    setSelectedEIP6963Provider(null);
    setSelectedEIP6963Info(null);
  };
  const setWallet = params => {
    const { setSelectedEIP6963Provider } = useExternalStore();
    const locWallet = params[0];

    instance.value = locWallet;
    address.value = locWallet.getAddressString();
    isHardware.value = locWallet.hasOwnProperty('isHardware')
      ? locWallet.isHardware
      : false;
    identifier.value = locWallet.identifier;
    if (!locWallet.hasOwnProperty('isHardware')) {
      nickname.value = locWallet.getNickname();
    }
    setWeb3Instance(params[1]);
    setSelectedEIP6963Provider(params[1]);
  };
  const setTokens = params => {
    tokens.value = params;
  };
  const setAccountBalance = balance => {
    balance.value = balance;
  };
  const setLedgerBluetooth = val => {
    ledgerBLE.value = val;
  };
  const setWeb3Instance = provider => {
    const { currentNetwork, Networks, gasPrice, network } = useGlobalStore();
    const hostUrl = currentNetwork.value.url
      ? url.parse(currentNetwork.value.url)
      : Networks.value['ETH'][0];
    const options = {};
    // eslint-disable-next-line
    const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
      currentNetwork.value.port ? ':' + currentNetwork.value.port : ''
    }${hostUrl.pathname ? hostUrl.pathname : ''}`;
    currentNetwork.value.username !== '' && currentNetwork.value.password !== ''
      ? (options['headers'] = {
          authorization: `Basic: ${btoa(
            currentNetwork.value.username + ':' + currentNetwork.value.password
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
          ? web3Instance.eth.getTransactionCount(address.value)
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
            ? network.value.type.chainID
            : arr[i].chainId;
          arr[i].gasPrice =
            arr[i].gasPrice === undefined ? gasPrice.value : arr[i].gasPrice;
          arr[i] = formatters.inputCallFormatter(arr[i]);
        }
        const batchSignCallback = promises => {
          if (promises instanceof Error) {
            reject(promises);
          }
          if (promises && promises.rejected)
            reject(new Error('User rejected transaction'));
          if (identifier.value === WALLET_TYPES.WEB3_WALLET) {
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
          isHardware.value
        );
      });
    };
    web3.value = web3Instance;
  };
  const setOwnedDomains = ownedDomains => {
    ensDomains.value = ownedDomains;
  };
  const setLoadingWalletInfo = isLoading => {
    loadingWalletInfo.value = isLoading;
  };
  const setBlockNumber = val => {
    blockNumber.value = val;
  };
  const setOfflineApp = val => {
    isOfflineApp.value = val;
  };
  const setLedgerApp = val => {
    ledgerApp.value = val;
  };
  const setSwapRates = val => {
    swapRates.value = val;
  };

  return {
    localStore,
    address,
    balance,
    blockNumber,
    identifier,
    nickname,
    isHardware,
    ledgerBLE,
    ledgerApp,
    instance,
    isOfflineApp,
    web3,
    ensDomains,
    tokens,
    loadingWalletInfo,
    swapRates,
    balanceInETH,
    balanceInWei,
    totalOwnedDomains,
    tokensList,
    hasGasPriceOption,
    removeWallet,
    setWallet,
    setTokens,
    setAccountBalance,
    setLedgerBluetooth,
    setWeb3Instance,
    setOwnedDomains,
    setLoadingWalletInfo,
    setBlockNumber,
    setOfflineApp,
    setLedgerApp,
    setSwapRates
  };
});
