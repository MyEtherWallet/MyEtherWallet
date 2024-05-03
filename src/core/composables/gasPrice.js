import { ref, watch, onMounted } from 'vue';
import BigNumber from 'bignumber.js';
import { fromWei, toWei } from 'web3-utils';

import { gasPriceTypes, estimatedTime } from '@/core/helpers/gasPriceHelper';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

export const useGasPrice = () => {
  // injections/use
  const {
    gasPrice,

    gasPriceByType,

    online,
    setGasPriceType,
    updateGasPrice
  } = useGlobalStore();
  const { isOfflineApp, web3 } = useWalletStore();
  const { fiatValue } = useExternalStore();

  // data
  const localGas = ref(null);
  const convertedGasPrice = ref(null);

  // computed
  const gasButtons = () => {
    if (!gasPrice) return [];
    const economy = fromWei(gasPriceByType(gasPriceTypes.ECONOMY));
    const regular = fromWei(gasPriceByType(gasPriceTypes.REGULAR));
    const fast = fromWei(gasPriceByType(gasPriceTypes.FAST));
    return [
      {
        title: gasPriceTypes.ECONOMY,
        gas: `${economy}`,
        usd: `$ ${
          formatFiatValue(BigNumber(fiatValue).times(fromWei(toWei(economy))))
            .value
        }`,
        time: estimatedTime(gasPriceTypes.ECONOMY),
        priority: 'Normal priority'
      },
      {
        title: gasPriceTypes.REGULAR,
        gas: `${regular}`,
        usd: `$ ${
          formatFiatValue(BigNumber(fiatValue).times(fromWei(toWei(regular))))
            .value
        }`,
        time: estimatedTime(gasPriceTypes.REGULAR),
        priority: 'Higher priority'
      },
      {
        title: gasPriceTypes.FAST,
        gas: `${fast}`,
        usd: `$ ${
          formatFiatValue(BigNumber(fiatValue).times(fromWei(toWei(fast))))
            .value
        }`,
        time: estimatedTime(gasPriceTypes.FAST),
        priority: 'Highest priority'
      }
    ];
  };
  watch(web3, () => {
    fetchGasPrice();
  });

  // mounted
  onMounted(() => {
    fetchGasPrice();
  });

  // methods
  const setSelected = selected => {
    setGasPriceType(selected);
  };
  const fetchGasPrice = () => {
    if (online && !isOfflineApp) updateGasPrice();
  };

  return {
    localGas,
    convertedGasPrice,
    gasButtons,
    setSelected,
    fetchGasPrice
  };
};
