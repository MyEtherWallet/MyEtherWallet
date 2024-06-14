import { useEthBlocksTxsStore } from './eth-blocks/store';
import { useStakewiseStore } from './stakewise/store';
import { useCoinbaseStakingStore } from './coinbase-staking/store';
import { useStakedStore } from './staked-dapp/store';

import EthBlockConfigs from './eth-blocks/store/configs';
import EnsManagerStore from './ens-manager-dapp/store/configs';
import StakewiseConfigs from './stakewise/store/configs';
import StakedConfigs from './staked-dapp/store/configs';
import CoinbaseStaking from './coinbase-staking/store/configs';

// const dappStore = {
//   useEthBlocksTxsStore: ethBlocksTxs,
//   useEnsManagerStoreStore: EnsManagerStore,
//   useStakewiseStore: stakewise,
//   useStakedStore: stakedStore,
//   useCoinbaseStakingStore: coinbaseStaking
// };

const dappStoreBeforeCreate = () => {
  const ethBlocksTxsStore = useEthBlocksTxsStore();
  const stakewiseStore = useStakewiseStore();
  const stakedStoreStore = useStakedStore();
  const coinbaseStakingStore = useCoinbaseStakingStore();
  ethBlocksTxsStore.initStore();
  stakewiseStore.initStore();
  stakedStoreStore.initStore();
  coinbaseStakingStore.initStore();
};

const dappStoreConfigs = {
  LOCAL_STORAGE_KEYS: {
    ...EthBlockConfigs.LOCAL_STORAGE_KEYS,
    ...EnsManagerStore.LOCAL_STORAGE_KEYS,
    ...StakewiseConfigs.LOCAL_STORAGE_KEYS,
    ...StakedConfigs.LOCAL_STORAGE_KEYS,
    ...CoinbaseStaking.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    ...EthBlockConfigs.VERSION,
    ...EnsManagerStore.VERSION,
    ...StakewiseConfigs.VERSION,
    ...StakedConfigs.VERSION,
    ...CoinbaseStaking.VERSION
  }
};

export { dappStoreBeforeCreate, dappStoreConfigs };
