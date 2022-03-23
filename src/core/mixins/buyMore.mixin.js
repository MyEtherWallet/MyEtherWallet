/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '../plugins/eventBus';
import { MOONPAY_EVENT } from '@/modules/moon-pay/helpers';
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
