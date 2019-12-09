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
          :release-date="dapp.releaseDate"
        />
      </div>
      <div v-if="soDapps.length > 0">
        <div class="line-container">
          <div class="line"></div>
          <a
            href="https://www.stateofthedapps.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('mewcx.powered-by') }}
            <img
              :alt="$t('mewcx.sotd')"
              src="@/assets/images/icons/dapps/sotd.png"
            />
          </a>
          <div class="line"></div>
        </div>
        <div class="buttons-container">
          <dapp-buttons
            v-for="dapp in soDapps"
            :key="dapp.title"
            :title="dapp.name"
            :icon="dapp.iconUrl"
            :desc="dapp.teaser"
            :param="'/interface/dapps/' + dapp.slug"
            :supported-networks="['ETH']"
            :release-date="dapp.created"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import DappButtons from '../../components/DappButtons';
import dapps from '@/dapps';
import { mapState } from 'vuex';

export default {
  name: 'DappsContainer',
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'dapp-buttons': DappButtons
  },
  data() {
    return {
      dapps,
      soDapps: []
    };
  },
  computed: {
    ...mapState(['network', 'online']),
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
  mounted() {
    if (this.online) {
      this.fetchDapps();
    }
  },
  methods: {
    async fetchDapps() {
      const dapps = await fetch(
        'https://api.stateofthedapps.com/dapps?tags=mew'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          // eslint-disable-next-line
        console.error(e);
        });
      this.soDapps = dapps.items.map(item => item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DappsContainer.scss';
</style>
