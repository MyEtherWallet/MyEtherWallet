import BigNumber from 'bignumber.js';
import { mapGetters, mapState, mapActions } from 'vuex';
import { SENTRY, Toast } from '@/modules/toast/handler/handlerToast';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { fromWei, toWei } from 'web3-utils';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

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
    ...mapGetters('external', ['fiatValue']),
    ...mapState('global', ['gasPriceType', 'baseGasPrice']),
    gasButtons() {
      if (!this.localGas) return [];
      const economy = fromWei(
        getGasBasedOnType(this.localGas, gasPriceTypes.ECONOMY),
        'gwei'
      );
      const regular = fromWei(
        getGasBasedOnType(this.localGas, gasPriceTypes.REGULAR),
        'gwei'
      );
      const fast = fromWei(
        getGasBasedOnType(this.localGas, gasPriceTypes.FAST),
        'gwei'
      );
      return [
        {
          icon: 'bicycle',
          title: gasPriceTypes.ECONOMY,
          gas: `${economy}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(economy, 'gwei')))
            ).value
          }`
        },
        {
          icon: 'car',
          title: gasPriceTypes.REGULAR,
          gas: `${regular}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(regular, 'gwei')))
            ).value
          }`
        },
        {
          icon: 'rocket',
          title: gasPriceTypes.FAST,
          gas: `${fast}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(fast, 'gwei')))
            ).value
          }`
        }
      ];
    }
  },
  watch: {
    gasPrice() {
      this.fetchGasPrice();
    },
    gasPriceType(e) {
      if (!this.useGlobal) {
        if (e !== gasPriceTypes.STORED) {
          this.setSelected(e);
        } else {
          this.setCustomGasPrice(this.gasPrice);
        }
      }
    }
  },
  methods: {
    ...mapActions('global', ['setGasPrice', 'setGasPriceType']),
    setSelected(selected) {
      try {
        this.setGasPriceType(selected).then(() => {
          this.setGasPrice(this.localGas);
        });
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    },
    setCustomGasPrice(customGasPrice) {
      this.setGasPriceType(gasPriceTypes.STORED).then(() => {
        this.setGasPrice(
          getGasBasedOnType(toWei(customGasPrice, 'gwei'), gasPriceTypes.STORED)
        );
      });
    },
    fetchGasPrice() {
      this.web3.eth.getGasPrice().then(gp => {
        this.localGas = gp;
      });
    }
  }
};

export default gasPriceMixin;
