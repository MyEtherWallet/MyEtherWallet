import { EventBus } from '../plugins/eventBus';
import { BUYSELL_EVENT } from '@/modules/buy-sell/helpers';
import { useRoute } from 'vue-router/composables';

export const useBuySell = () => {
  const route = useRoute();
  const openBuySell = module => {
    EventBus.$emit(BUYSELL_EVENT, [module, route.path]);
  };

  return { openBuySell };
};
