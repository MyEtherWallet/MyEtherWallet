/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '../plugins/eventBus';
import { MOONPAY_EVENT } from '@/modules/buy-sell/helpers';
export default {
  name: 'BuyMoreMixin',
  data() {
    return {};
  },
  methods: {
    openMoonpay() {
      EventBus.$emit(MOONPAY_EVENT);
    }
  }
};
