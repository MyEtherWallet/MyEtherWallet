import { _ } from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

const actualTokenMixin = {
  props: {
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    },
    preSelectedToken: {
      default: () => {
        return {};
      },
      type: Object
    },
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    }
  },
  computed: {
    ...mapState('wallet', ['address']),
    actualToken() {
      if (
        this.handler &&
        !_.isEmpty(this.handler) &&
        !_.isEmpty(this.selectedToken)
      ) {
        const token = this.handler?.reservesData.find(item => {
          if (item.symbol === this.selectedToken.token) return item;
        });

        return token;
      }
      return {};
    },
    selectedTokenUSDValue() {
      return this.actualToken ? this.actualToken.price.priceInEth : 0;
    },
    selectedTokenInUserSummary() {
      return this.handler?.userSummary.reservesData.find(item => {
        if (item.reserve.symbol === this.selectedToken.token) {
          return item;
        }
      });
    },
    amountUsd() {
      const amount = this.amount ? this.amount : 0;
      return `$ ${BigNumber(this.selectedTokenUSDValue)
        .times(amount)
        .toFixed(2)}`;
    }
  }
};

export default actualTokenMixin;
