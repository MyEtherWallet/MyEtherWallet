<template>
  <div class="dapps-container">
    <div>
      <interface-container-title :title="$t('common.dapps')" />
      <div class="buttons-container">
        <dapp-buttons
          v-for="dapp in sortedObject"
          :key="dapp.title"
          :title="$t(dapp.title)"
          :icon="dapp.icon"
          :icon-disabled="dapp.iconDisabled"
          :desc="$t(dapp.desc)"
          :param="dapp.route"
          :supported-networks="dapp.supportedNetworks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';
import { mapGetters } from 'vuex';

export default {
  name: 'DappsContainer',
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons
  },
  data() {
    return {
      localDapps: dapps
    };
  },
  computed: {
    ...mapGetters({
      network: 'network'
    }),
    sortedObject() {
      const arrayedDapp = [];
      Object.keys(dapps).forEach(dapp => {
        arrayedDapp.push(dapps[dapp]);
      });

      return arrayedDapp.sort((a, b) => {
        if (
          a.supportedNetworks.includes(this.network.type.name) ||
          b.supportedNetworks.includes(this.network.type.name)
        )
          return 1;
        return 0;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
