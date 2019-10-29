<template>
  <div class="dapps-container">
    <div class="wallets-container-header">
      <div class="header-title-container">
        <div class="title-balance">
          <h2>
            Dapps
            <a href="https://www.stateofthedapps.com" target="_blank">
              Powered by
              <img
                src="@/assets/images/icons/dapps/sotd.png"
                alt="state of the dapps"
              />
            </a>
          </h2>
        </div>
      </div>
      <network-picker-component
        :network="network"
        :open-network-modal="openNetworkModal"
      />
    </div>
    <div />
    <router-view :dapps="dapps" />
  </div>
</template>

<script>
import NetworkPickerComponent from '../../components/NetworkPickerComponent';
export default {
  components: {
    'network-picker-component': NetworkPickerComponent
  },
  props: {
    network: {
      type: Object,
      default: () => {
        return {};
      }
    },
    openNetworkModal: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      dapps: []
    };
  },
  computed: {
    filteredArr() {
      return this.dapps;
    }
  },
  mounted() {
    this.fetchDapps();
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
      this.dapps = dapps.items.map(item => item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionDappsContainer.scss';
@import '../ExtensionWalletContainer/ExtensionWalletContainer.scss';
</style>
