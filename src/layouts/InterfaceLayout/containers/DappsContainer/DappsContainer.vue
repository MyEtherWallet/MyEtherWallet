<template>
  <div class="dapps-container">
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
        :release-date="dapp.releaseDate"
      />
    </div>
    <interface-container-footer />
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import InterfaceContainerFooter from '../../components/InterfaceContainerFooter';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';
import { mapState } from 'vuex';
import { Misc } from '@/helpers';
export default {
  name: 'DappsContainer',
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-container-footer': InterfaceContainerFooter,
    'dapp-buttons': DappButtons
  },
  data() {
    const newDapps = dapps;
    if (Misc.dateChecker()) {
      newDapps['manageEns'].supportedNetworks = [];
    }
    return {
      dapps: newDapps
    };
  },
  computed: {
    ...mapState('main', ['network']),
    sortedObject() {
      const arrayedDapp = [];
      Object.keys(this.dapps).forEach(dapp => {
        arrayedDapp.push(this.dapps[dapp]);
      });
      return arrayedDapp
        .sort((a, b) => {
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        })
        .sort((a, b) => {
          if (
            a.supportedNetworks.includes(this.network.type.name) ||
            b.supportedNetworks.includes(this.network.type.name)
          )
            return 1;
          return 0;
        });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
