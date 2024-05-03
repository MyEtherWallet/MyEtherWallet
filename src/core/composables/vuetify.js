import { getCurrentInstance } from 'vue';

export const useVuetify = () => {
  const vm = getCurrentInstance();
  return vm.proxy?.$vuetify || undefined;
};
