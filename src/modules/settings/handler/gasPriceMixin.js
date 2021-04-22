import BigNumber from 'bignumber.js';
import { mapGetters, mapState, mapActions } from 'vuex';
import { SENTRY, Toast } from '@/modules/toast/handler/handlerToast';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { fromWei, toWei } from 'web3-utils';

const gasPriceMixin = {
  data() {
    return {
      localGas: null,
      convertedGasPrice: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['gasPrice']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapState('global', ['gasPriceType']),
    gasButtons() {
      const economy = this.localGas
        ? fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.ECONOMY),
            'gwei'
          )
        : 0;
      const regular = this.localGas
        ? fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.REGULAR),
            'gwei'
          )
        : 0;
      const fast = this.localGas
        ? fromWei(getGasBasedOnType(this.localGas, gasPriceTypes.FAST), 'gwei')
        : 0;

      const economyEth = this.localGas
        ? fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.ECONOMY),
            'ether'
          )
        : 0;
      const regularEth = this.localGas
        ? fromWei(
            getGasBasedOnType(this.localGas, gasPriceTypes.REGULAR),
            'ether'
          )
        : 0;
      const fastEth = this.localGas
        ? fromWei(getGasBasedOnType(this.localGas, gasPriceTypes.FAST), 'ether')
        : 0;
      return [
        {
          icon: 'bicycle',
          title: gasPriceTypes.ECONOMY,
          gas: `${economy}`,
          usd: `$ ${BigNumber(this.ETHUSDValue.value)
            .times(economyEth)
            .toFixed(9)}`
          // time: '< 30 min'
        },
        {
          icon: 'car',
          title: gasPriceTypes.REGULAR,
          gas: `${regular}`,
          usd: `$ ${BigNumber(this.ETHUSDValue.value)
            .times(regularEth)
            .toFixed(9)}`
          // time: '< 10 min'
        },
        {
          icon: 'rocket',
          title: gasPriceTypes.FAST,
          gas: `${fast}`,
          usd: `$ ${BigNumber(this.ETHUSDValue.value)
            .times(fastEth)
            .toFixed(9)}`
          // time: '< 5 min'
        }
      ];
    }
  },
  methods: {
    ...mapActions('global', ['setGasPrice', 'setGasPriceType']),
    setSelected(selected, setGlobal = true) {
      if (setGlobal) {
        try {
          this.setGasPriceType(selected).then(() => {
            this.setGasPrice(this.localGas);
          });
        } catch (e) {
          Toast(e, {}, SENTRY);
        }
      } else {
        this.convertedGasPrice = getGasBasedOnType(this.gasPrice, selected);
      }
    },
    setCustomGasPrice(customGasPrice, setGlobal = true) {
      if (setGlobal) {
        this.setGasPriceType(gasPriceTypes.STORED).then(() => {
          this.setGasPrice(
            getGasBasedOnType(
              toWei(customGasPrice, 'gwei'),
              gasPriceTypes.STORED
            )
          );
        });
      } else {
        this.convertedGasPrice = customGasPrice;
      }
    },
    async fetchGasPrice() {
      try {
        this.localGas = await this.web3.eth.getGasPrice();
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    }
  }
};

export default gasPriceMixin;
