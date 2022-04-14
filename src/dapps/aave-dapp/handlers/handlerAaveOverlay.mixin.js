import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';

const handlerAaveOverlay = {
  props: {
    isLoadingData: {
      type: Boolean,
      default: true
    },
    userSummary: {
      type: Object,
      default: () => {}
    },
    reservesData: {
      type: Array,
      default: () => []
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
    ...mapGetters('external', ['fiatValue']),
    selectedTokenToUse() {
      return this.selectedToken || this.preSelectedToken;
    },
    selectedTokenDetails() {
      return this.reservesData.find(item => {
        if (item.symbol === this.selectedTokenToUse.token) return item;
      });
    },
    selectedTokenUSD() {
      return new BigNumber(
        this.selectedTokenDetails?.price?.priceInEth || 0
      ).times(this.fiatValue);
    },
    selectedTokenInUserSummary() {
      return this.userSummary?.reservesData?.find(item => {
        if (item.reserve.symbol === this.selectedTokenToUse.token) {
          return item;
        }
      });
    },
    amountUsd() {
      return `$
        ${
          formatFiatValue(
            BigNumber(this.selectedTokenUSD).times(this.amount || 0)
          ).value
        }`;
    }
  }
};

export default handlerAaveOverlay;
