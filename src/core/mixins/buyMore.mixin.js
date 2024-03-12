/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '../plugins/eventBus';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
export default {
  name: 'BuyMoreMixin',
  methods: {
    openBuySell(module) {
      EventBus.$emit(BUYSELL_EVENT, [module, this.$route.path]);
    }
  }
};
