/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '../plugins/eventBus';
import { STAKEWISE_EVENT } from '@/dapps/stakewise/handlers/configs.js';
export default {
  name: 'StakeMixin',
  data() {
    return {};
  },
  methods: {
    openStakewise() {
      EventBus.$emit(STAKEWISE_EVENT);
    }
  }
};
