import matchNetwork from '@/core/helpers/matchNetwork';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useSwapStore } from '../swap';
import { useWalletStore } from '../wallet';
import { useExternalStore } from '../external';

const setOnlineStatus = function (val) {
  const { setWeb3Instance } = useWalletStore();
  if (val) setWeb3Instance(null);
  this.online = val;
};

const setLocale = function (val) {
  this.locale = val;
};
const setPreferredCurrency = function (val) {
  this.preferredCurrency = val;
};

const updateGasPrice = function () {
  const { web3 } = useWalletStore();
  const { gasPriceMultiplier } = this.network.type;
  if (!this.isEIP1559SupportedNetwork) {
    return web3.eth.getGasPrice().then(res => {
      const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier);
      return this.setGasPrice(modifiedGasPrice.toString());
    });
  }
  return web3.eth.getGasPrice().then(gasPrice => {
    const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier);
    const priorityFee = toBNSafe(modGas).sub(
      toBNSafe(this.eip1559.baseFeePerGas)
    );
    return this.setMaxPriorityFeePerGas(priorityFee);
  });
};
const setGasPrice = function (gasPrice) {
  this.baseGasPrice = gasPrice;
};

const setGasPriceType = function (type) {
  this.gasPriceType = type;
};
const setNetwork = async function ({ network, walletType }) {
  const { selectedEIP6963Provider } = useExternalStore();
  const { resetPrefetch } = useSwapStore();
  const chainID = network?.type?.chainID;
  const matched = await matchNetwork(
    chainID,
    walletType,
    selectedEIP6963Provider
  );
  if (matched) {
    const _netObj = Object.assign({}, network);
    _netObj.type = {
      name: network.type.name
    };
    this.currentNetwork = _netObj;
    resetPrefetch(null);
    return;
  }
  throw new Error('Network not found');
};
const setValidNetwork = function (valid) {
  this.validNetwork = valid;
};
const addLocalContract = function (localContract) {
  if (!this.localContracts[this.currentNetwork.type.name])
    this.localContracts[this.currentNetwork.type.name] = [];
  this.localContracts[this.currentNetwork.type.name].push(localContract);
};
const setImportedState = function (stateObj) {
  stateObj['localStore'] = true;
  Object.keys(stateObj).forEach(item => {
    this.$state[item] = stateObj[item];
  });
};
const setMaxPriorityFeePerGas = function (valBN) {
  this.eip1559.maxPriorityFeePerGas = valBN.toString();
};

const setBaseFeePerGas = function (valBN) {
  this.eip1559.baseFeePerGas = valBN.toString();
};

const setDarkMode = function (val) {
  this.darkMode = val;
};

export default {
  updateGasPrice,
  setOnlineStatus,
  setLocale,
  setPreferredCurrency,
  setValidNetwork,
  setNetwork,
  setGasPrice,
  setGasPriceType,
  setImportedState,
  addLocalContract,
  setMaxPriorityFeePerGas,
  setBaseFeePerGas,
  setDarkMode
};
