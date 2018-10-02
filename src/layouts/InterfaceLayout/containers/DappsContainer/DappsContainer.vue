<template>
  <div class="dapps-container">
    <div>
      <interface-container-title :title="$t('common.dapps')"/>
      <div class="buttons-container">
        <dapp-buttons
          v-for="dapp in Object.keys(localDapps)"
          :key="localDapps[dapp].title"
          :title="$t(localDapps[dapp].title)"
          :icon="localDapps[dapp].icon"
          :desc="$t(localDapps[dapp].desc)"
          :active="localDapps[dapp].active"
          :param="localDapps[dapp].route"/>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons
  },
  data() {
    return {
      localDapps: dapps
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
