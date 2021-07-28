import _ from 'underscore';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

const aaveOverlayMixin = {
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
    actualSelectedToken() {
      const selectedTokens = _.isEmpty(this.selectedToken)
        ? _.isEmpty(this.preSelectedToken)
          ? {}
          : this.preSelectedToken
        : this.selectedToken;
      return selectedTokens;
    },
    actualToken() {
      if (this.handler && !_.isEmpty(this.handler)) {
        const token = this.handler?.reservesData.find(item => {
          if (item.symbol === this.actualSelectedToken.token) return item;
        });

        return token;
      }
      return {};
    },
    selectedTokenUSDValue() {
      return this.actualToken ? this.actualToken?.price?.priceInEth : 0;
    },
    selectedTokenInUserSummary() {
      return this.handler?.userSummary?.reservesData?.find(item => {
        if (item.reserve.symbol === this.actualSelectedToken.token) {
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

export default aaveOverlayMixin;
