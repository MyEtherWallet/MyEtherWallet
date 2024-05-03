import { useGlobalStore } from '@/core/store/global';

const customTokens = function (state) {
  const { network } = useGlobalStore();
  return state.tokens[network.type.name] || [];
};

const hasCustom = function () {
  return customTokens.length > 0;
};

const hiddenTokens = function (state) {
  const { network } = useGlobalStore();
  return state.hiddenTokensHolder[network.type.name] || [];
};

const hasHidden = function () {
  return this.hiddenTokens.length > 0;
};

export default {
  customTokens,
  hasCustom,
  hiddenTokens,
  hasHidden
};
