/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '../plugins/eventBus';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
export default {
  name: 'BuyMoreMixin',
  data() {
    return {};
  },
  methods: {
    openBuySell() {
      EventBus.$emit(BUYSELL_EVENT);
    }
  }
};
