import BigNumber from 'bignumber.js';
import { mapGetters, mapState, mapActions } from 'vuex';
import { gasPriceTypes, estimatedTime } from '@/core/helpers/gasPriceHelper';
import { fromWei, toWei } from 'web3-utils';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { toBN } from 'web3-utils';

const gasPriceMixin = {
  data() {
    return {
      localGas: null,
      convertedGasPrice: '0'
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['gasPrice', 'network', 'gasPriceByType']),
    ...mapGetters('external', ['fiatValue']),
    ...mapState('global', ['gasPriceType', 'baseGasPrice']),
    gasButtons() {
      if (!this.gasPrice) return [];
      const economy = fromWei(this.gasPriceByType(gasPriceTypes.ECONOMY));
      const regular = fromWei(this.gasPriceByType(gasPriceTypes.REGULAR));
      const fast = fromWei(this.gasPriceByType(gasPriceTypes.FAST));
      return [
        {
          title: gasPriceTypes.ECONOMY,
          gas: `${economy}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(economy)))
            ).value
          }`,
          time: estimatedTime(gasPriceTypes.ECONOMY),
          priority: 'Normal priority'
        },
        {
          title: gasPriceTypes.REGULAR,
          gas: `${regular}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(regular)))
            ).value
          }`,
          time: estimatedTime(gasPriceTypes.REGULAR),
          priority: 'Higher priority'
        },
        {
          title: gasPriceTypes.FAST,
          gas: `${fast}`,
          usd: `$ ${
            formatFiatValue(
              BigNumber(this.fiatValue).times(fromWei(toWei(fast)))
            ).value
          }`,
          time: estimatedTime(gasPriceTypes.FAST),
          priority: 'Highest priority'
        }
      ];
    }
  },
  watch: {
    gasPrice() {
      this.fetchGasPrice();
    },
    web3() {
      this.fetchGasPrice();
    }
  },
  mounted() {
    this.fetchGasPrice();
  },
  methods: {
    ...mapActions('global', ['setGasPrice', 'setGasPriceType']),
    setSelected(selected) {
      this.setGasPriceType(selected);
    },
    fetchGasPrice() {
      this.web3.eth.getGasPrice().then(res => {
        const modifiedGasPrice = toBN(res).muln(
          this.network.type.gasPriceMultiplier
        );
        this.setGasPrice(modifiedGasPrice.toString());
      });
    }
  }
};

export default gasPriceMixin;
