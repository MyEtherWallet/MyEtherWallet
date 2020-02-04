<template>
  <extension-browser-action-wrapper>
    <template v-slot:header>
      <div class="wallets-container-header">
        <div class="header-title-container">
          <div class="title-balance">
            <h2>
              {{ $t('mewcx.dapps') }}
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
            </h2>
          </div>
        </div>
      </div>
    </template>
    <div class="dapps-container">
      <router-view :dapps="dapps" />
    </div>
  </extension-browser-action-wrapper>
</template>

<script>
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
export default {
  components: {
    'extension-browser-action-wrapper': ExtensionBrowserActionWrapper
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
        'https://swap.mewapi.io/proxy?url=https://api.stateofthedapps.com/dapps?tags=mew'
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
